
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductService from "../../services/ProductService";
import type { Product } from "../../services/ProductService";

type CategoryFilter = "TOUS" | "AGRICULTURE" | "PISCICULTURE";

function formatPrice(value: number | string): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return `${value} FC`;
  }

  return `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(amount)} FC`;
}

function formatDate(value: string): string {
  if (!value) return "Date à confirmer";

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function AcheteurHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("TOUS");

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await ProductService.getProducts();
        const productList = Array.isArray(data) ? data : data.results;

        if (active) {
          setProducts(Array.isArray(productList) ? productList : []);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);

        if (active) {
          setError(
            "Impossible de charger les produits. Vérifiez votre connexion puis réessayez."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const availableProducts = useMemo(
    () =>
      products.filter((product) => {
        const status = product.status?.toUpperCase();
        const quantity = Number(product.quantity_available);

        return (
          quantity > 0 &&
          status !== "SOLD_OUT" &&
          status !== "CANCELLED" &&
          status !== "DRAFT"
        );
      }),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("fr");

    return availableProducts.filter((product) => {
      const matchesCategory =
        category === "TOUS" || product.category === category;

      const matchesSearch =
        !term ||
        product.title?.toLocaleLowerCase("fr").includes(term) ||
        product.location?.toLocaleLowerCase("fr").includes(term) ||
        product.producer_name?.toLocaleLowerCase("fr").includes(term) ||
        product.description?.toLocaleLowerCase("fr").includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [availableProducts, category, search]);

  const agricultureCount = availableProducts.filter(
    (product) => product.category === "AGRICULTURE"
  ).length;

  const piscicultureCount = availableProducts.filter(
    (product) => product.category === "PISCICULTURE"
  ).length;

  return (
    <main className="buyer-home">
      <section className="buyer-hero">
        <div className="buyer-hero-content">
          <span className="buyer-eyebrow">
            🌱 Du producteur à votre table
          </span>

          <h1>
            Les bonnes récoltes,
            <br />
            <span>au bon moment.</span>
          </h1>

          <p className="buyer-hero-description">
            Découvrez les produits agricoles et piscicoles, consultez leur
            disponibilité et préparez vos commandes directement auprès des
            producteurs.
          </p>

          <a href="#catalogue" className="buyer-hero-button">
            Explorer les produits <span aria-hidden="true">→</span>
          </a>

          <div className="buyer-hero-benefits">
            <span>✓ Disponibilités visibles</span>
            <span>✓ Producteurs identifiés</span>
            <span>✓ Commandes en ligne</span>
          </div>
        </div>

        <div className="buyer-hero-art" aria-hidden="true">
          <div className="buyer-hero-orbit buyer-hero-orbit-one" />
          <div className="buyer-hero-orbit buyer-hero-orbit-two" />

          <div className="buyer-hero-illustration">
            <span className="buyer-hero-leaf">🌿</span>
            <span className="buyer-hero-produce">🌽</span>
            <span className="buyer-hero-fruit">🍅</span>
            <span className="buyer-hero-fish">🐟</span>
          </div>

          <div className="buyer-floating-note">
            <span className="buyer-note-icon">✓</span>
            <span>
              <strong>Votre prochain achat</strong>
              <small>Commence ici</small>
            </span>
          </div>
        </div>
      </section>

      <section className="buyer-catalogue page-container" id="catalogue">
        <div className="buyer-section-heading">
          <div>
            <span className="buyer-section-eyebrow">LE MARCHÉ AGRICOLE</span>
            <h2>Découvrez nos produits</h2>
            <p>
              Trouvez ce dont vous avez besoin et consultez les informations
              avant de commander.
            </p>
          </div>

          <div className="buyer-catalogue-count">
            <strong>{availableProducts.length}</strong>
            <span>
              {availableProducts.length > 1
                ? "produits disponibles"
                : "produit disponible"}
            </span>
          </div>
        </div>

        <div className="buyer-filter-panel">
          <div className="buyer-search-box">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un produit, une ville..."
              aria-label="Rechercher un produit, une ville ou un producteur"
            />
            {search && (
              <button
                type="button"
                className="buyer-clear-search"
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
              >
                ×
              </button>
            )}
          </div>

          <div
            className="buyer-category-filters"
            role="group"
            aria-label="Filtrer par catégorie"
          >
            <button
              type="button"
              className={category === "TOUS" ? "active" : ""}
              onClick={() => setCategory("TOUS")}
            >
              Tous <span>{availableProducts.length}</span>
            </button>

            <button
              type="button"
              className={category === "AGRICULTURE" ? "active" : ""}
              onClick={() => setCategory("AGRICULTURE")}
            >
              🌾 Agriculture <span>{agricultureCount}</span>
            </button>

            <button
              type="button"
              className={category === "PISCICULTURE" ? "active" : ""}
              onClick={() => setCategory("PISCICULTURE")}
            >
              🐟 Pisciculture <span>{piscicultureCount}</span>
            </button>
          </div>
        </div>

        {loading && (
          <div className="buyer-state-panel" role="status">
            <div className="spinner-border text-success" aria-hidden="true" />
            <h3>Nous préparons le marché...</h3>
            <p>Chargement des produits disponibles.</p>
          </div>
        )}

        {!loading && error && (
          <div className="buyer-state-panel buyer-error-panel" role="alert">
            <span className="buyer-state-icon">!</span>
            <h3>Le marché est momentanément inaccessible</h3>
            <p>{error}</p>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="buyer-product-grid">
            {filteredProducts.map((product) => (
              <article className="buyer-product-card" key={product.id}>
                <div
                  className={`buyer-product-visual ${product.category === "PISCICULTURE"
                    ? "visual-fish"
                    : "visual-farm"
                    }`}
                >
                  <span className="buyer-product-emoji" aria-hidden="true">
                    {product.category === "PISCICULTURE" ? "🐟" : "🌾"}
                  </span>

                  <span className="buyer-product-category">
                    {product.category === "PISCICULTURE"
                      ? "Pisciculture"
                      : "Agriculture"}
                  </span>
                </div>

                <div className="buyer-product-body">
                  <div className="buyer-product-location">
                    <span aria-hidden="true">⌖</span>
                    {product.location || "Localisation à confirmer"}
                  </div>

                  <h3>{product.title}</h3>

                  <div className="buyer-product-producer">
                    <span className="buyer-producer-avatar" aria-hidden="true">
                      🌱
                    </span>
                    <span>
                      <small>Producteur</small>
                      <strong>{product.producer_name || "Producteur Agri_Mark"}</strong>
                    </span>
                  </div>

                  <div className="buyer-product-details">
                    <div>
                      <small>Disponible</small>
                      <strong>
                        {product.quantity_available} {product.unit}
                      </strong>
                    </div>

                    <div>
                      <small>À partir de</small>
                      <strong className="buyer-product-price">
                        {formatPrice(product.price_per_unit)}
                        <small> / {product.unit}</small>
                      </strong>
                    </div>
                  </div>

                  <div className="buyer-product-date">
                    <span aria-hidden="true">▦</span>
                    Disponible le {formatDate(product.available_date)}
                  </div>

                  <Link
                    to={`/acheteur/produit/${product.id}`}
                    className="buyer-product-link"
                  >
                    Voir le produit <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="buyer-state-panel buyer-empty-panel">
            <span className="buyer-state-icon" aria-hidden="true">⌕</span>
            <h3>
              {availableProducts.length === 0
                ? "Le marché se prépare"
                : "Aucun produit ne correspond à votre recherche"}
            </h3>
            <p>
              {availableProducts.length === 0
                ? "Les producteurs publieront ici leurs prochaines récoltes et leurs produits piscicoles."
                : "Essayez un autre nom, une autre localisation ou une autre catégorie."}
            </p>

            {(search || category !== "TOUS") && (
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => {
                  setSearch("");
                  setCategory("TOUS");
                }}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </section>

      <section className="buyer-how-it-works page-container">
        <div className="buyer-how-heading">
          <span className="buyer-section-eyebrow">SIMPLE ET PRATIQUE</span>
          <h2>Comment fonctionne Agri_Mark ?</h2>
          <p>De la découverte du produit à la préparation de votre commande.</p>
        </div>

        <div className="buyer-steps-grid">
          <article className="buyer-step">
            <span className="buyer-step-number">01</span>
            <span className="buyer-step-icon" aria-hidden="true">🔎</span>
            <h3>Explorez</h3>
            <p>
              Parcourez les produits et vérifiez les quantités, les prix et les
              dates de disponibilité.
            </p>
          </article>

          <article className="buyer-step">
            <span className="buyer-step-number">02</span>
            <span className="buyer-step-icon" aria-hidden="true">🧺</span>
            <h3>Commandez</h3>
            <p>
              Choisissez un produit et la quantité souhaitée selon les stocks
              disponibles.
            </p>
          </article>

          <article className="buyer-step">
            <span className="buyer-step-number">03</span>
            <span className="buyer-step-icon" aria-hidden="true">🤝</span>
            <h3>Suivez votre commande</h3>
            <p>
              Retrouvez vos commandes dans votre espace et consultez leur
              statut.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default AcheteurHome;
