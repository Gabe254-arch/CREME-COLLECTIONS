export const getProductImage = (imageArray) => {
  if (Array.isArray(imageArray) && imageArray[0]) {
    return imageArray[0].startsWith('/uploads/')
      ? `http://localhost:5000${imageArray[0]}`
      : imageArray[0];
  }

  // ✅ Correct fallback to default image in /public folder
  return `${import.meta.env.BASE_URL}default-product.png`;
};
