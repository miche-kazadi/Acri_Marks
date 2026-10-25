
import { useCallback, useEffect, useState } from "react";
import ProductService, { type Product } from "../../services/ProductService";

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  OPEN: "Disponible",
  SOLD_OUT: "Épuisé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

export default function MyProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await ProductService.getMyProducts();
      setProducts(data);
    } catch (err) {
      console.error("Erreur lors du chargement des produits :", err);
      setError(
        "Impossible de charger vos produits. Vérifiez votre connexion et votre session.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  if (loading) {
    return (
      <div className="container py-4">
        Chargement de vos produits...
      </div>
    );
  }

  return (
    <main className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h2 mb-1">Mes produits</h1>
          <p className="text-muted mb-0">
            Gérez les produits que vous proposez aux acheteurs.
          </p>
        </div>

        <button
          className="btn btn-outline-success"
          onClick={() => void loadProducts()}
        >
          Actualiser
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!error && products.length === 0 ? (
        <div className="alert alert-info">
          Vous n'avez pas encore publié de produits.
        </div>
      ) : (
        <div className="row g-3">
          {products.map((product) => (
            <div className="col-12 col-md-6 col-xl-4" key={product.id}>
              <article className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                    <h2 className="h5 mb-0">{product.title}</h2>
                    <span className="badge text-bg-success">
                      {statusLabels[product.status] || product.status}
                    </span>
                  </div>

                  <p className="text-muted small mb-2">
                    {product.category === "AGRICULTURE"
                      ? "Agriculture"
                      : "Pisciculture"}
                  </p>

                  <p className="mb-2">
                    Quantité disponible :{" "}
                    <strong>
                      {product.quantity_available} {product.unit}
                    </strong>
                  </p>

                  <p className="mb-2">
                    Quantité initiale :{" "}
                    {product.quantity_total} {product.unit}
                  </p>

                  <p className="mb-2">
                    Prix unitaire :{" "}
                    <strong>
                      {Number(product.price_per_unit).toLocaleString("fr-FR")} FC
                    </strong>
                  </p>

                  <p className="mb-2">
                    Disponibilité : {product.available_date}
                  </p>

                  <p className="mb-2">Localisation : {product.location}</p>

                  <p className="text-muted mb-0">
                    {product.description || "Aucune description."}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
