
import Api from "./Api";

export interface Product {
  id: number;
  title: string;
  category: "AGRICULTURE" | "PISCICULTURE";
  quantity_total: number | string;
  quantity_available: number | string;
  unit: string;
  price_per_unit: number | string;
  available_date: string;
  location: string;
  description: string;
  status: string;
  producer_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductData {
  title: string;
  category: "AGRICULTURE" | "PISCICULTURE";
  quantity_total: number;
  unit: string;
  price_per_unit: number;
  available_date: string;
  location: string;
  description: string;
}

const getProducts = async (): Promise<Product[] | { results: Product[] }> => {
  const response = await Api.get("/products/");
  return response.data;
};

const getProductById = async (id: string): Promise<Product> => {
  const response = await Api.get(`/products/${id}/`);
  return response.data;
};
const getMyProducts = async (): Promise<Product[]> => {
  const response = await Api.get("/producer/products/");
  return response.data;
};

const createProduct = async (product: CreateProductData): Promise<Product> => {
  const response = await Api.post("/products/", product);
  return response.data;
};

export default {
  getProducts,
  getProductById,
  createProduct,
  getMyProducts
};
