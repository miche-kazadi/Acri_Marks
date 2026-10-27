import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

function Login() {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const data = await AuthService.login(phoneOrEmail.trim(), password);

      // Redirection selon le rôle
      // Redirection selon le type de compte
      if (data.profile.is_staff && data.profile.is_superuser) {
        navigate("/admin", { replace: true });
      } else if (data.profile.role === "ACHETEUR") {
        navigate("/acheteur", { replace: true });
      } else if (data.profile.role === "PRODUCTEUR") {
        navigate("/producteur", { replace: true });
      } else {
        setError("Votre compte ne possède aucun rôle valide.");
      }
    } catch (err: any) {
      if (err.response?.data) {
        setError(
          err.response.data.detail ||
          err.response.data.non_field_errors?.[0] ||
          "Identifiants incorrects."
        );
      } else {
        setError("Impossible de contacter le serveur.");
      }
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-success-subtle min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                {/* Titre */}
                <div className="text-center mb-4">
                  <div
                    className="bg-success text-white rounded-4 d-inline-flex align-items-center justify-content-center mb-3 fs-2"
                    style={{ width: 64, height: 64 }}
                  >
                    🌾
                  </div>
                  <h1 className="h3 fw-bold mb-1">Agri_Mark</h1>
                  <p className="text-muted mb-0">
                    Connectez-vous à votre compte
                  </p>
                </div>

                {/* Erreur */}
                {error && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Fermer"
                      onClick={() => setError("")}
                    />
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <fieldset disabled={loading} className="border-0 p-0 m-0">
                    {/* Email / téléphone */}
                    <div className="mb-3">
                      <label
                        htmlFor="phoneOrEmail"
                        className="form-label fw-semibold"
                      >
                        Email ou numéro de téléphone
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light">👤</span>
                        <input
                          id="phoneOrEmail"
                          type="text"
                          className="form-control"
                          value={phoneOrEmail}
                          onChange={(e) => setPhoneOrEmail(e.target.value)}
                          placeholder="Email ou téléphone"
                          autoComplete="username"
                          autoFocus
                          required
                        />
                      </div>
                    </div>

                    {/* Mot de passe */}
                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="form-label fw-semibold"
                      >
                        Mot de passe
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light">🔒</span>
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Votre mot de passe"
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={
                            showPassword
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
                          }
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </div>

                    {/* Bouton */}
                    <button
                      type="submit"
                      className="btn btn-success btn-lg w-100 fw-semibold"
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            aria-hidden="true"
                          />
                          Connexion...
                        </>
                      ) : (
                        "Se connecter"
                      )}
                    </button>
                  </fieldset>
                </form>

                {/* Inscription */}
                <hr className="my-4" />
                <div className="text-center">
                  <p className="text-muted mb-1">
                    Vous n'avez pas encore de compte ?
                  </p>
                  <Link
                    to="/register"
                    className="btn btn-outline-success w-100"
                  >
                    Créer un compte
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;