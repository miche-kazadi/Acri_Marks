import Api from "./Api";

const getProducts = async () => {
  const response = await Api.get("/products/");

  return response.data;
};

const getProductById = async (id: string) => {
  const response = await Api.get(`/products/${id}/`);

  return response.data;
};

export default {
  getProducts,
  getProductById,
};