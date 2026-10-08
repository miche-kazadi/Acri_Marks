import { useEffect, useState } from "react";
import OrderService from "../../services/OrderService";

type Order = {
  id: number;
  product: number;
  product_title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: string;
  created_at: string;
};

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await OrderService.getMyOrders();

        console.log("Mes commandes :", data);

        setOrders(data.results || data);
      } catch (error) {
        console.error("Erreur commandes :", error);
        setError("Impossible de charger vos commandes.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">
            Chargement...
          </span>
        </div>

        <p className="mt-3">
          Chargement de vos commandes...
        </p>
      </div>
    );
  }
  const handleCancelOrder = async (orderId: number) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment annuler cette commande ?"
    );

    if (!confirmed) {
      return;
    }

    setCancellingId(orderId);
    setError("");

    try {
      const updatedOrder = await OrderService.cancelOrder(orderId);

      console.log("Commande annulée :", updatedOrder);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
              ...order,
              status: updatedOrder.status,
            }
            : order
        )
      );
    } catch (error: any) {
      console.error("Erreur annulation :", error);

      if (error.response?.data) {
        setError(
          error.response.data.detail ||
          "Impossible d'annuler la commande."
        );
      } else {
        setError("Impossible de contacter le serveur.");
      }
    } finally {
      setCancellingId(null);
    }
  };

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="mb-5">
        <h1>🧾 Mes commandes</h1>

        <p className="text-muted">
          Retrouvez ici toutes vos commandes.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          Vous n'avez encore passé aucune commande.
        </div>
      ) : (
        <div className="row g-4">

          {orders.map((order) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={order.id}
            >
              <div className="card h-100 shadow-sm">

                <div className="card-body">

                  <h2 className="h5">
                    Commande #{order.id}
                  </h2>

                  <p>
                    🌾 Produit :{" "}
                    <strong>
                      {order.product_title}
                    </strong>
                  </p>

                  <p>
                    📦 Quantité :{" "}
                    <strong>
                      {order.quantity}
                    </strong>
                  </p>

                  <p>
                    💰 Prix unitaire :{" "}
                    <strong>
                      {order.unit_price}
                    </strong>
                  </p>

                  <p>
                    💵 Total :{" "}
                    <strong>
                      {order.total_price}
                    </strong>
                  </p>

                  <p>
                    📌 Statut :{" "}
                    <span className="badge bg-warning text-dark">
                      {order.status}
                    </span>
                  </p>
                  {order.status === "PENDING" && (
                    <button
                      className="btn btn-outline-danger w-100 mt-2"
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingId === order.id}
                    >
                      {cancellingId === order.id
                        ? "Annulation..."
                        : "Annuler la commande"}
                    </button>
                  )}

                  <p className="small text-muted">
                    📅{" "}
                    {new Date(order.created_at).toLocaleString()}
                  </p>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Orders;