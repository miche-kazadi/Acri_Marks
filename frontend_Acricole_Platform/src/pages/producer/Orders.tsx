
import { useCallback, useEffect, useState } from "react";
import OrderService, { type Order } from "../../services/OrderService";

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  READY: "Prête",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

export default function ProducerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await OrderService.getProducerOrders();
      setOrders(data);
    } catch (err) {
      console.error("Erreur lors du chargement des commandes :", err);
      setError("Impossible de charger les commandes. Vérifie ta connexion.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const changeStatus = async (order: Order, newStatus: string) => {
    setUpdatingId(order.id);
    setError("");

    try {
      await OrderService.updateOrderStatus(order.id, newStatus);
      await loadOrders();
    } catch (err) {
      console.error("Erreur lors de la modification du statut :", err);
      setError(
        "Impossible de modifier le statut. Vérifie les autorisations et le statut actuel.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const availableActions: Record<string, { label: string; status: string }[]> = {
    PENDING: [
      { label: "Confirmer", status: "CONFIRMED" },
      { label: "Annuler", status: "CANCELLED" },
    ],
    CONFIRMED: [
      { label: "Marquer comme prête", status: "READY" },
      { label: "Annuler", status: "CANCELLED" },
    ],
    READY: [{ label: "Terminer la commande", status: "COMPLETED" }],
    COMPLETED: [],
    CANCELLED: [],
  };

  if (loading) {
    return <div className="container py-5">Chargement des commandes...</div>;
  }

  return (
    <main className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h2 mb-1">Commandes reçues</h1>
          <p className="text-muted mb-0">
            Suivez les réservations de vos produits.
          </p>
        </div>

        <button className="btn btn-outline-success" onClick={() => void loadOrders()}>
          Actualiser
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {orders.length === 0 ? (
        <div className="alert alert-info">
          Vous n'avez pas encore reçu de commandes.
        </div>
      ) : (
        <div className="row g-3">
          {orders.map((order) => (
            <div className="col-12" key={order.id}>
              <article className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-between gap-3">
                    <div>
                      <h2 className="h5 mb-2">
                        {order.product_title || `Produit #${order.product}`}
                      </h2>
                      <p className="mb-1">
                        Acheteur : {order.buyer_name || "Non renseigné"}
                      </p>
                      <p className="mb-1">
                        Quantité commandée : <strong>{order.quantity}</strong>
                      </p>
                      <p className="mb-1">
                        Prix unitaire :{" "}
                        {Number(order.unit_price).toLocaleString("fr-FR")} FC
                      </p>
                      <p className="mb-0">
                        Total :{" "}
                        <strong>
                          {Number(order.total_price).toLocaleString("fr-FR")} FC
                        </strong>
                      </p>
                    </div>

                    <div className="text-md-end">
                      <span className="badge text-bg-success mb-3">
                        {statusLabels[order.status] || order.status}
                      </span>

                      <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                        {(availableActions[order.status] || []).map((action) => (
                          <button
                            key={action.status}
                            className={`btn btn-sm ${action.status === "CANCELLED"
                              ? "btn-outline-danger"
                              : "btn-success"
                              }`}
                            disabled={updatingId === order.id}
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Confirmer l'action : ${action.label.toLowerCase()} ?`,
                                )
                              ) {
                                void changeStatus(order, action.status);
                              }
                            }}
                          >
                            {updatingId === order.id
                              ? "Mise à jour..."
                              : action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
