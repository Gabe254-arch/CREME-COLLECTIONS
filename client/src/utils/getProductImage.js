// ✅ src/utils/getProductImage.js

export const getProductImage = (imageArray) => {
  const baseURL =
    import.meta.env.VITE_SERVER_URL ||
    (import.meta.env.MODE === 'development'
      ? 'http://localhost:5000'
      : 'https://www.cremecollections.shop');

  if (Array.isArray(imageArray) && imageArray.length > 0) {
    const imagePath = imageArray[0];

    // ✅ Full external URL (CDN or remote image)
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // ✅ Local upload path (e.g., /uploads/img.png)
    if (imagePath.startsWith('/uploads/')) {
      return `${baseURL}${imagePath}`;
    }
  }

  // ❌ Fallback to public/default-product.png or hosted fallback
  return `${baseURL}/uploads/default-product.png`;
};
