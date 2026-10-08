import { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/AuthService";

function Login() {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await AuthService.login(
        phoneOrEmail,
        password
      );

      console.log("Login réussi :", data);

      const profile = await AuthService.getProfile();

      console.log("Profil connecté :", profile);

    } catch (error: any) {
      console.error("Erreur login :", error);

      if (error.response?.data) {
        setError(
          error.response.data.detail ||
          error.response.data.non_field_errors?.[0] ||
          "Identifiants incorrects."
        );
      } else {
        setError("Impossible de contacter le serveur.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">

        <div className="col-12 col-sm-10 col-md-7 col-lg-5">

          <div className="card shadow border-0">
            <div className="card-body p-4 p-md-5">

              {/* Titre */}
              <div className="text-center mb-4">
                <h1 className="fw-bold">
                  🌾 Agri_Mark
                </h1>

                <p className="text-muted">
                  Connectez-vous à votre compte
                </p>
              </div>

              {/* Erreur */}
              {error && (
                <div
                  className="alert alert-danger"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Email / téléphone */}
                <div className="mb-3">
                  <label
                    htmlFor="phoneOrEmail"
                    className="form-label fw-semibold"
                  >
                    Email ou numéro de téléphone
                  </label>

                  <input
                    id="phoneOrEmail"
                    type="text"
                    className="form-control"
                    value={phoneOrEmail}
                    onChange={(event) =>
                      setPhoneOrEmail(event.target.value)
                    }
                    placeholder="Email ou numéro de téléphone"
                    required
                  />
                </div>

                {/* Mot de passe */}
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="form-label fw-semibold"
                  >
                    Mot de passe
                  </label>

                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Votre mot de passe"
                    required
                  />
                </div>

                {/* Bouton */}
                <button
                  type="submit"
                  className="btn btn-success w-100 py-2"
                  disabled={loading}
                >
                  {loading
                    ? "Connexion..."
                    : "Se connecter"}
                </button>

              </form>

              {/* Inscription */}
              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  Vous n'avez pas encore de compte ?
                </p>

                <Link
                  to="/register"
                  className="btn btn-link text-decoration-none"
                >
                  Créer un compte
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;