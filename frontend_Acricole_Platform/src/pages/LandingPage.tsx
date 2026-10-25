
import { Link } from "react-router-dom";

const features = [
  {
    icon: "🌾",
    title: "Publication des récoltes",
    description:
      "Présentez vos produits agricoles ou piscicoles, leurs quantités, leurs prix et leurs dates de disponibilité.",
  },
  {
    icon: "🛒",
    title: "Précommandes",
    description:
      "Permettez aux acheteurs de réserver les produits avant leur arrivée sur le marché.",
  },
  {
    icon: "📦",
    title: "Gestion des commandes",
    description:
      "Consultez les commandes reçues ou passées et suivez leur évolution.",
  },
  {
    icon: "📍",
    title: "Informations claires",
    description:
      "Indiquez la localisation, la quantité disponible et les informations utiles sur vos produits.",
  },
  {
    icon: "🤝",
    title: "Connexion directe",
    description:
      "Facilitez les échanges entre producteurs, commerçants, restaurants et autres acheteurs.",
  },
  {
    icon: "🔐",
    title: "Espaces par rôle",
    description:
      "Chaque utilisateur accède aux fonctionnalités correspondant à son rôle.",
  },
];

const steps = [
  {
    number: "01",
    title: "Créez votre compte",
    description:
      "Inscrivez-vous comme producteur ou acheteur pour accéder à votre espace.",
  },
  {
    number: "02",
    title: "Publiez ou découvrez",
    description:
      "Les producteurs publient leurs récoltes à venir. Les acheteurs découvrent les produits proposés.",
  },
  {
    number: "03",
    title: "Réservez et suivez",
    description:
      "Passez une commande et consultez son évolution depuis votre espace.",
  },
];

function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <div className="landing-container landing-nav">
          <Link to="/" className="landing-brand" aria-label="Agri_Mark, accueil">
            <span className="landing-brand-icon">🌱</span>
            <span>Agri<span>_Mark</span></span>
          </Link>

          <nav className="landing-nav-links" aria-label="Navigation principale">
            <a href="#fonctionnalites">Fonctionnalités</a>
            <a href="#fonctionnement">Comment ça marche</a>
            <a href="#communaute">Communauté</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="landing-nav-actions">
            <Link to="/login" className="landing-login-link">
              Se connecter
            </Link>
            <Link to="/register" className="landing-button landing-button-small">
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-container landing-hero-grid">
          <div className="landing-hero-content">
            <div className="landing-eyebrow">
              <span>🌿</span> Agriculture · Pisciculture · Commerce
            </div>

            <h1>
              Les bonnes récoltes,
              <span> au bon moment.</span>
            </h1>

            <p className="landing-hero-description">
              Agri_Mark rapproche les producteurs et les acheteurs. Découvrez
              les récoltes à venir, réservez vos produits et préparez vos ventes
              avant même leur arrivée en ville.
            </p>

            <div className="landing-hero-actions">
              <Link to="/register" className="landing-button">
                Rejoindre Agri_Mark <span>→</span>
              </Link>
              <Link to="/login" className="landing-button landing-button-light">
                Se connecter
              </Link>
            </div>

            <div className="landing-hero-note">
              <span>✓</span> Une plateforme pensée pour les échanges agricoles
            </div>
          </div>

          <div className="landing-hero-visual" aria-label="Illustration agricole">
            <div className="landing-photo">
              <div className="landing-photo-overlay">
                <span className="landing-photo-label">Du producteur à l'acheteur</span>
                <strong>La prochaine récolte se prépare aujourd'hui.</strong>
              </div>
            </div>

            <div className="landing-floating-card landing-floating-top">
              <span className="landing-floating-icon">🌽</span>
              <span>
                <strong>Récoltes à venir</strong>
                <small>Anticipez vos achats</small>
              </span>
            </div>

            <div className="landing-floating-card landing-floating-bottom">
              <span className="landing-floating-icon">🤝</span>
              <span>
                <strong>Échanges facilités</strong>
                <small>Producteurs & acheteurs</small>
              </span>
            </div>
          </div>
        </div>

        <div className="landing-container landing-hero-bottom">
          <span>Produire avec confiance.</span>
          <span>Réserver avec anticipation.</span>
          <span>Vendre avec plus de visibilité.</span>
        </div>
      </section>

      <section className="landing-community section-space" id="communaute">
        <div className="landing-container">
          <div className="landing-section-heading">
            <span className="landing-section-kicker">Notre communauté</span>
            <h2>Un même objectif : mieux connecter l'offre et la demande.</h2>
            <p>
              Que vous cultiviez, éleviez des poissons, vendiez au marché ou
              gériez un restaurant, Agri_Mark vous aide à préparer vos échanges.
            </p>
          </div>

          <div className="landing-role-grid">
            <article className="landing-role-card">
              <div className="landing-role-icon">👨🏿‍🌾</div>
              <h3>Producteurs</h3>
              <p>
                Faites connaître vos récoltes à venir, indiquez vos quantités
                disponibles et recevez des commandes.
              </p>
              <Link to="/register">Je suis producteur <span>→</span></Link>
            </article>

            <article className="landing-role-card">
              <div className="landing-role-icon">🛍️</div>
              <h3>Acheteurs et commerçants</h3>
              <p>
                Trouvez les produits dont vous avez besoin et préparez vos achats
                selon les dates de disponibilité.
              </p>
              <Link to="/register">Je suis acheteur <span>→</span></Link>
            </article>

            <article className="landing-role-card">
              <div className="landing-role-icon">🍽️</div>
              <h3>Restaurants et revendeurs</h3>
              <p>
                Anticipez vos besoins en approvisionnement et repérez les
                produits proposés par les producteurs.
              </p>
              <Link to="/register">Découvrir la plateforme <span>→</span></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-features section-space" id="fonctionnalites">
        <div className="landing-container">
          <div className="landing-section-heading">
            <span className="landing-section-kicker">Fonctionnalités</span>
            <h2>Les outils essentiels pour vos échanges agricoles.</h2>
            <p>
              Des fonctionnalités centrées sur les produits, les disponibilités
              et les commandes, sans compliquer votre activité.
            </p>
          </div>

          <div className="landing-feature-grid">
            {features.map((feature) => (
              <article className="landing-feature-card" key={feature.title}>
                <div className="landing-feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-how section-space" id="fonctionnement">
        <div className="landing-container">
          <div className="landing-section-heading">
            <span className="landing-section-kicker">Démarrage</span>
            <h2>Trois étapes pour commencer.</h2>
            <p>
              Rejoignez la plateforme et commencez à organiser vos échanges
              entre producteurs et acheteurs.
            </p>
          </div>

          <div className="landing-steps-grid">
            {steps.map((step) => (
              <article className="landing-step" key={step.number}>
                <span className="landing-step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>

          <div className="landing-center-action">
            <Link to="/register" className="landing-button">
              Commencer maintenant <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-contact section-space" id="contact">
        <div className="landing-container landing-contact-panel">
          <div>
            <span className="landing-section-kicker">Contact & partenariat</span>
            <h2>Vous souhaitez faire grandir votre activité ?</h2>
            <p>
              Vous êtes producteur, acheteur ou partenaire et souhaitez en
              savoir plus sur Agri_Mark ? Rejoignez la plateforme ou connectez-vous
              pour découvrir votre espace.
            </p>
          </div>
          <div className="landing-contact-actions">
            <Link to="/register" className="landing-button landing-button-white">
              Créer un compte <span>→</span>
            </Link>
            <Link to="/login" className="landing-contact-login">
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container landing-footer-content">
          <Link to="/" className="landing-brand landing-footer-brand">
            <span className="landing-brand-icon">🌱</span>
            <span>Agri<span>_Mark</span></span>
          </Link>
          <p>
            Connecter les producteurs aux acheteurs, récolte après récolte.
          </p>
          <span>© {new Date().getFullYear()} Agri_Mark</span>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;
