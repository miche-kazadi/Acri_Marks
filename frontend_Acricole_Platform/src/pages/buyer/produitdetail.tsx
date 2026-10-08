import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import OrderService from "../../services/OrderService";

type Product = {
  id: number;
  title: string;
  category: string;
  quantity_available: number;
  unit: string;
  price_per_unit: number;
  location: string;
  available_date: string;
  description: string;
  producer_name?: string;
  status: string;
};

function ProduitDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [ordering, setOrdering] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await ProductService.getProductById(id!);

        console.log("Produit détail :", data);

        setProduct(data);
      } catch (error) {
        console.error("Erreur détail produit :", error);
        setError("Impossible de charger le produit.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>

        <p className="mt-3">
          Chargement du produit...
        </p>
      </div>
    );
  }
  const handleOrder = async () => {
    if (!product) return;

    setOrdering(true);
    setOrderMessage("");
    setError("");

    try {
      const order = await OrderService.createOrder(
        product.id,
        quantity
      );

      console.log("Commande créée :", order);

      setOrderMessage("Commande passée avec succès !");
    } catch (error: any) {
      console.error("Erreur commande :", error);

      if (error.response?.data) {
        setError(
          error.response.data.detail ||
          "Impossible de passer la commande."
        );
      } else {
        setError("Impossible de contacter le serveur.");
      }
    } finally {
      setOrdering(false);
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

  if (!product) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Produit introuvable.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-12 col-md-8 col-lg-7">

          <div className="card shadow-sm">

            <div className="card-body p-4">

              <span className="badge bg-success mb-3">
                {product.category}
              </span>

              <h1 className="h2 mb-3">
                {product.title}
              </h1>

              <p className="text-muted">
                {product.description}
              </p>

              <hr />

              <p>
                📦 Quantité disponible :{" "}
                <strong>
                  {product.quantity_available} {product.unit}
                </strong>
              </p>

              <p>
                💰 Prix :{" "}
                <strong>
                  {product.price_per_unit}
                </strong>
              </p>

              <p>
                📍 Localisation :{" "}
                <strong>
                  {product.location}
                </strong>
              </p>

              <p>
                📅 Disponible le :{" "}
                <strong>
                  {product.available_date}
                </strong>
              </p>

              {product.producer_name && (
                <p>
                  🌾 Producteur :{" "}
                  <strong>
                    {product.producer_name}
                  </strong>
                </p>
              )}

              <div className="mt-4">

                <label className="form-label">
                  Quantité à commander ({product.unit})
                </label>

                <input
                  type="number"
                  className="form-control mb-3"
                  min="1"
                  max={product.quantity_available}
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(Number(event.target.value))
                  }
                />

                {orderMessage && (
                  <div className="alert alert-success">
                    {orderMessage}
                  </div>
                )}

                <button
                  className="btn btn-success w-100"
                  onClick={handleOrder}
                  disabled={ordering || quantity > product.quantity_available}
                >
                  {ordering ? "Commande en cours..." : "Commander"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProduitDetail;