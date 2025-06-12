import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import 'aos/dist/aos.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import InvoiceHistoryPage from './pages/client/InvoiceHistoryPage';



// 🔐 Context Providers
import { AuthProvider, useAuth } from './context/authContext';
import { CartProvider } from './context/CartContext';

// 🔔 Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 📄 Layouts
import Header from './components/Header';
import RequireAuth from './components/RequireAuth';
import AdminLayout from './layouts/AdminLayout';

// 🧑‍💼 Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ShopPage from './pages/ShopPage';
import LandingPage from './pages/LandingPage';

// 📜 Legal & Public Pages
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsAndConditions';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ReturnsPolicyPage from './pages/ReturnsPolicyPage';
import ShippingPolicyPage from './pages/legal/ShippingPolicyPage';
import LegalDisclaimerPage from './pages/legal/LegalDisclaimerPage';
import ContactPage from './pages/ContactPage';
import SitemapPage from './pages/SitemapPage';

// 👤 Client Dashboard
import ClientDashboardLayout from './pages/client/ClientDashboardLayout';
import MyOrdersPage from './pages/client/MyOrdersPage'; 
import ProfilePage from './pages/client/ProfilePage';
import WishlistPage from './pages/client/WishlistPage';
import AddressBookPage from './pages/client/AddressBookPage';
import SupportPage from './pages/client/SupportPage';

// 🛠 Admin Panel
import AdminDashboard from './pages/AdminDashboard';
import AdminOverview from './pages/AdminOverview';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import AdminLogsPage from './pages/AdminLogsPage';
import AdminSummaryPage from './pages/AdminSummaryPage';

// 👔 Shop Manager Panel
import ShopManagerDashboard from './pages/shopmanager/ShopManagerDashboard';
import ShopManagerProducts from './pages/shopmanager/ShopManagerProducts';
import ShopManagerOrders from './pages/shopmanager/ShopManagerOrders';
import ShopManagerChat from './pages/shopmanager/ShopManagerChat';
import ShopManagerActivityLog from './pages/shopmanager/ShopManagerActivityLog';

// ✅ Admin route wrapper
const AdminRoute = ({ element, roles }) => (
  <RequireAuth allowedRoles={roles}>
    <AdminLayout>{element}</AdminLayout>
  </RequireAuth>
);

// ✅ Authenticated App Routes
function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* 🚪 Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders/:id" element={<OrderDetailPage />} />
      <Route path="/confirm/:id" element={<OrderConfirmationPage />} />
    <Route path="/forgot" element={<ForgotPasswordPage />} />

      {/* 📜 Legal / Public Pages */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/returns" element={<ReturnsPolicyPage />} />
      <Route path="/shipping" element={<ShippingPolicyPage />} />
      <Route path="/disclaimer" element={<LegalDisclaimerPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/sitemap" element={<SitemapPage />} />

      {/* 🛍️ Shop Routes */}
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/:categorySlug" element={<ShopPage />} />
      <Route path="/shop/:categorySlug/:subSlug" element={<ShopPage />} />

      {/* 👤 Client Dashboard */}
     <Route path="/account" element={
  <RequireAuth allowedRoles={['customer']}>
    <ClientDashboardLayout />
  </RequireAuth>
}>
  <Route path="profile" element={<ProfilePage />} />
  <Route path="orders" element={<MyOrdersPage />} />
  <Route path="wishlist" element={<WishlistPage />} />
  <Route path="address" element={<AddressBookPage />} />
  <Route path="support" element={<SupportPage />} />
  <Route path="invoices" element={<InvoiceHistoryPage />} />
</Route>


      {/* 🛠 Admin + Shop Manager Dashboard */}
      <Route path="/admin" element={<AdminRoute roles={['admin', 'superadmin', 'shopmanager']} element={<AdminDashboard />} />} />
      <Route path="/admin/overview" element={<AdminRoute roles={['admin', 'superadmin']} element={<AdminOverview />} />} />
      <Route path="/admin/orders" element={<AdminRoute roles={['admin', 'superadmin', 'shopmanager']} element={<AdminOrdersPage />} />} />
      <Route path="/admin/users" element={<AdminRoute roles={['admin', 'superadmin']} element={<AdminUsersPage />} />} />
      <Route path="/admin/products" element={<AdminRoute roles={['admin', 'superadmin', 'shopmanager']} element={<AdminProductsPage />} />} />
      <Route path="/admin/product/new" element={<AdminRoute roles={['admin', 'superadmin', 'shopmanager']} element={<AddProductPage />} />} />
      <Route path="/admin/product/:id/edit" element={<AdminRoute roles={['admin', 'superadmin', 'shopmanager']} element={<EditProductPage />} />} />
      <Route path="/admin/logs" element={<AdminRoute roles={['admin', 'superadmin']} element={<AdminLogsPage />} />} />
      <Route path="/admin/summary" element={<AdminRoute roles={['admin', 'superadmin']} element={<AdminSummaryPage />} />} />

      {/* 👔 Shop Manager Routes */}
      <Route path="/shopmanager" element={<RequireAuth allowedRoles={['shopmanager']}><ShopManagerDashboard /></RequireAuth>} />
      <Route path="/shopmanager/products" element={<RequireAuth allowedRoles={['shopmanager']}><ShopManagerProducts /></RequireAuth>} />
      <Route path="/shopmanager/orders" element={<RequireAuth allowedRoles={['shopmanager']}><ShopManagerOrders /></RequireAuth>} />
      <Route path="/shopmanager/chat" element={<RequireAuth allowedRoles={['shopmanager']}><ShopManagerChat /></RequireAuth>} />
      <Route path="/shopmanager/logs" element={<RequireAuth allowedRoles={['shopmanager']}><ShopManagerActivityLog /></RequireAuth>} />

      {/* 🌍 Catch-All */}
      <Route path="*" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
    </Routes>
  );
}

// ✅ App Wrapper
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ToastContainer position="top-right" autoClose={3000} />
          <Header />
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
