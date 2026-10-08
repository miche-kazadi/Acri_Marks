import { useEffect, useState } from "react";
import ProductService from "../../services/ProductService";
import { Link } from "react-router-dom";

type Product = {
  id: number;
  title: string;
  category: string;
  quantity_available: number;
  unit: string;
  price_per_unit: number;
  location: string;
  available_date: string;
  producer_name?: string;
};

function AcheteurHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await ProductService.getProducts();

        console.log("PRODUIT :", data.results[0]);

        setProducts(data.results);
      } catch (error) {
        console.error("Erreur produits :", error);
        setError("Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="container py-5">

      <div className="mb-5">
        <h1>🛒 Bienvenue sur Agri_Mark</h1>

        <p className="text-muted">
          Découvrez les produits agricoles et piscicoles disponibles.
        </p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div
            className="spinner-border text-success"
            role="status"
          >
            <span className="visually-hidden">
              Chargement...
            </span>
          </div>

          <p className="mt-3">
            Chargement des produits...
          </p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="alert alert-info">
          Aucun produit disponible pour le moment.
        </div>
      )}

      <div className="row g-4">

        {products.map((product) => (
          <div
            className="col-12 col-md-6 col-lg-4"
            key={product.id}
          >
            <Link
              to={`/acheteur/produit/${product.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 shadow-sm">

                <div className="card-body">

                  <h2 className="h5">
                    {product.title}
                  </h2>

                  <p className="text-muted mb-2">
                    {product.category}
                  </p>

                  <p>
                    📦 Disponible :{" "}
                    <strong>
                      {product.quantity_available}{" "}
                      {product.unit}
                    </strong>
                  </p>

                  <p>
                    💰 Prix :{" "}
                    <strong>
                      {product.price_per_unit}
                    </strong>
                  </p>

                  <p className="mb-2">
                    📍 {product.location}
                  </p>

                  <p className="small text-muted">
                    📅 Disponible le :{" "}
                    {product.available_date}
                  </p>

                  {product.producer_name && (
                    <p className="small">
                      🌾 Producteur :{" "}
                      <strong>
                        {product.producer_name}
                      </strong>
                    </p>
                  )}

                </div>

              </div>
            </Link>
          </div>
        ))}

      </div>

    </div>
  );
}

export default AcheteurHome;