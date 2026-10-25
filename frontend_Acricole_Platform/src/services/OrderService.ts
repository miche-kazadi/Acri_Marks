import Api from "./Api";

export interface Order {
  id: number;
  product: number;
  product_title: string;
  buyer_name: string;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
  status: string;
  created_at: string;
}

const createOrder = async (
  productId: number,
  quantity: number,
) => {
  const response = await Api.post("/orders/", {
    product: productId,
    quantity: quantity,
  });

  return response.data;
};

const getMyOrders = async () => {
  const response = await Api.get("/orders/my-orders/");

  return response.data;
};

const cancelOrder = async (orderId: number) => {
  const response = await Api.post(
    `/orders/${orderId}/cancel/`
  );

  return response.data;
};

// Récupérer les commandes reçues par le producteur connecté
const getProducerOrders = async (): Promise<Order[]> => {
  const response = await Api.get("/producer/orders/");
  return response.data;
};

// Modifier le statut d'une commande reçue par le producteur
const updateOrderStatus = async (
  orderId: number,
  newStatus: string,
) => {
  const response = await Api.patch(
    `/orders/${orderId}/status/`,
    { status: newStatus },
  );

  return response.data;
};



export default {
  createOrder,
  getMyOrders,
  cancelOrder,
  getProducerOrders,
  updateOrderStatus,
};