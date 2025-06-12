// ---------------------------------------------
// 🚀 Creme Collections Backend Server (Amazon-Grade)
// ---------------------------------------------

const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cluster = require('cluster');
const os = require('os');
const path = require('path');
const compression = require('compression');
const responseTime = require('response-time');
const firewall = require('./middleware/firewall');
const cacheControl = require('./middleware/cacheControl');
const aiSEOEngine = require('./middleware/aiSEOEngine');
const trafficLogger = require('./middleware/trafficLogger');

// ---------------------------------------------
// 🌍 Load Environment Config
// ---------------------------------------------
dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env');
  process.exit(1);
}

// ---------------------------------------------
// 📦 Preload Models
// ---------------------------------------------
require('./models/User');
require('./models/Product');
require('./models/Order');
require('./models/Category');
require('./models/SubCategory');
require('./models/AdminLog');
require('./models/Newsletter');
require('./models/Promo');
require('./models/imageModel');
require('./models/ActionLog');

// ---------------------------------------------
// ⚙️ Connect DB & Init Express
// ---------------------------------------------
const connectDB = require('./config/db');
connectDB();
const app = express();

// ---------------------------------------------
// 🧠 Core Middlewares
// ---------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(responseTime());
app.use(firewall);
app.use(cacheControl);
app.use(aiSEOEngine);
app.use(trafficLogger);

// ---------------------------------------------
// ✅ CORS Setup
// ---------------------------------------------
const allowedOrigins = [
  'http://localhost:3000',
  'https://www.cremecollections.shop',
  'https://cremecollections.shop',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`⛔ Blocked by CORS policy: ${origin}`);
      return callback(new Error('❌ CORS policy: This origin is not allowed.'));
    },
    credentials: true,
  })
);

// ---------------------------------------------
// 📝 Request Logging (Dev Only)
// ---------------------------------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ---------------------------------------------
// 🚦 Rate Limiting (Prod Only)
// ---------------------------------------------
if (process.env.NODE_ENV === 'production') {
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 800,
      message: '⚠️ Too many requests. Please try again later.',
    })
  );
}

// ---------------------------------------------
// 📁 Serve Static Files
// ---------------------------------------------
const uploadsPath = path.join(__dirname, 'uploads');
app.use(
  '/uploads',
  express.static(uploadsPath, {
    setHeaders: (res, filePath) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', getMimeType(filePath));
    },
  })
);

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// ---------------------------------------------
// ✅ Health Check Endpoint
// ---------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: '✅ OK',
    uptime: process.uptime(),
    timestamp: Date.now(),
    version: '1.0.0',
  });
});

// ---------------------------------------------
// 📡 Mount API Routes (with handler check)
// ---------------------------------------------
const routes = [
  { path: '/api/users', module: './routes/userRoutes' },
  { path: '/api/test', module: './routes/testRoutes' },
  { path: '/api/products', module: './routes/productRoutes' },
  { path: '/api/orders', module: './routes/orderRoutes' },
  { path: '/api/categories', module: './routes/categoryRoutes' },
  // { path: '/api/subcategories', module: './routes/subcategoryRoutes' },
  { path: '/api/logs', module: './routes/logRoutes' },
  { path: '/api/upload', module: './routes/uploadRoutes' },
  { path: '/api/newsletter', module: './routes/newsletterRoutes' },
  { path: '/api/promos', module: './routes/promoRoutes' },
  { path: '/api/images', module: './routes/imageRoutes' },
  { path: '/api/summary', module: './routes/summaryRoutes' },
  { path: '/api/invoice', module: './routes/invoiceRoutes' },
  { path: '/api/ai', module: './routes/assistantRoutes' },
];

routes.forEach(({ path, module }) => {
  try {
    const handler = require(module);
    if (handler && typeof handler === 'function' && handler.stack) {
      console.log(`✅ Route mounted at ${path}`);
      app.use(path, handler);
    } else {
      console.warn(`⚠️ Route at "${path}" did not export a valid Express router.`);
    }
  } catch (err) {
    console.error(`❌ Failed to load ${module}: ${err.message}`);
  }
});

// ---------------------------------------------
// 🧾 React Frontend Fallback
// ---------------------------------------------
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// ---------------------------------------------
// ❌ 404 Fallback
// ---------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: `🔍 Route not found: ${req.originalUrl}` });
});

// ---------------------------------------------
// 💥 Global Error Handler
// ---------------------------------------------
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err.stack);
  res.status(500).json({
    success: false,
    message: '🚨 Internal Server Error',
    error: err.message || 'Unexpected backend failure.',
  });
});

// ---------------------------------------------
// 🧠 Cluster Mode
// ---------------------------------------------
const PORT = process.env.PORT || 5000;
const CPU_OVERRIDE = process.env.CPU_CORES || os.cpus().length;

if (cluster.isPrimary) {
  console.log(`👑 Master ${process.pid} starting ${CPU_OVERRIDE} workers...`);
  for (let i = 0; i < CPU_OVERRIDE; i++) cluster.fork();
  cluster.on('exit', (worker) => {
    console.warn(`💀 Worker ${worker.process.pid} crashed. Restarting...`);
    cluster.fork();
  });
} else {
  app.listen(PORT, () => {
    console.log(`🚀 Worker ${process.pid} listening on port ${PORT} [${process.env.NODE_ENV}]`);
  });
}

module.exports = app;
