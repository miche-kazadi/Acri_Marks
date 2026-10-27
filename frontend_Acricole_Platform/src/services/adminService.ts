import Api from "./Api";

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AdminUser {
  id: number;
  full_name: string;
  phone_or_email: string;
  role: "PRODUCTEUR" | "ACHETEUR" | "";
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface AdminStats {
  users: { total: number; producers: number; buyers: number };
  products: { total: number; open: number; sold_out: number };
  orders: { total: number; pending: number; confirmed: number; completed: number };
}

const getStats = async (): Promise<AdminStats> => {
  const { data } = await Api.get("/admin/stats/");
  return data;
};

const getUsers = async (params?: { search?: string; role?: string; page?: number }) => {
  const { data } = await Api.get("/admin/users/", { params });
  return data as Paginated<AdminUser>;
};

const setUserActive = async (id: number, is_active: boolean) => {
  const { data } = await Api.patch(`/admin/users/${id}/`, { is_active });
  return data as AdminUser;
};

const deleteUser = async (id: number) => {
  await Api.delete(`/admin/users/${id}/`);
};

const getProducts = async (params?: {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
}) => {
  const { data } = await Api.get("/admin/products/", { params });
  return data as Paginated<any>;
};

const updateProduct = async (id: number, payload: Record<string, unknown>) => {
  const { data } = await Api.patch(`/admin/products/${id}/`, payload);
  return data;
};

const deleteProduct = async (id: number) => {
  await Api.delete(`/admin/products/${id}/`);
};

const getOrders = async (params?: { status?: string; page?: number }) => {
  const { data } = await Api.get("/admin/orders/", { params });
  return data as Paginated<any>;
};

const updateOrderStatus = async (id: number, status: string) => {
  const { data } = await Api.patch(`/admin/orders/${id}/`, { status });
  return data;
};

export default {
  getStats,
  getUsers,
  setUserActive,
  deleteUser,
  getProducts,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
};