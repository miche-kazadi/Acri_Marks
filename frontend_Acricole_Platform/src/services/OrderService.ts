import Api from "./Api";

const createOrder = async (
  productId: number,
  quantity: number
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
  const response = await Api.patch(
    `/orders/${orderId}/cancel/`
  );

  return response.data;
};

export default {
  createOrder,
  getMyOrders,
  cancelOrder,
};