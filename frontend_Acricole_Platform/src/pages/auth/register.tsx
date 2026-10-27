import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/AuthService";

const ROLES = [
  { value: "ACHETEUR", id: "acheteur", icon: "🛒", label: "Acheteur" },
  { value: "PRODUCTEUR", id: "producteur", icon: "🌾", label: "Producteur" },
];

/* Récupère le premier message d'erreur renvoyé par l'API */
function getErrorMessage(err: any): string {
  const data = err?.response?.data;
  if (!err?.response) return "Impossible de contacter le serveur.";
  if (typeof data === "string") return data;
  if (data?.detail) return data.detail;

  const fields = ["phone_or_email", "full_name", "password", "role"];
  for (const field of fields) {
    const value = data?.[field];
    if (value) return Array.isArray(value) ? value[0] : String(value);
  }
  return "Impossible de créer le compte.";
}

function Register() {
  const [fullName, setFullName] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [role, setRole] = useState("ACHETEUR");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      await AuthService.register(
        fullName.trim(),
        role,
        phoneOrEmail.trim(),
        password
      );

      setSuccess("Votre compte a été créé avec succès !");

      setFullName("");
      setPhoneOrEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-success-subtle min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
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
                  <p className="text-muted mb-0">Créez votre compte</p>
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

                {/* Succès */}
                {success && (
                  <div className="alert alert-success" role="alert">
                    <p className="mb-2">✅ {success}</p>
                    <Link to="/login" className="btn btn-success btn-sm">
                      Se connecter maintenant
                    </Link>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <fieldset disabled={loading} className="border-0 p-0 m-0">
                    {/* Type de compte */}
                    <div className="mb-4">
                      <span className="form-label fw-semibold d-block">
                        Vous êtes qui ?
                      </span>

                      <div className="row g-2">
                        {ROLES.map((r) => (
                          <div className="col-6" key={r.id}>
                            <input
                              type="radio"
                              className="btn-check"
                              name="role"
                              id={r.id}
                              value={r.value}
                              checked={role === r.value}
                              onChange={(e) => setRole(e.target.value)}
                            />
                            <label
                              className="btn btn-outline-success w-100 py-3 rounded-3"
                              htmlFor={r.id}
                            >
                              <span className="fs-3 d-block">{r.icon}</span>
                              <span className="fw-semibold">{r.label}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Nom complet */}
                    <div className="mb-3">
                      <label
                        htmlFor="fullName"
                        className="form-label fw-semibold"
                      >
                        Nom complet
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light">👤</span>
                        <input
                          id="fullName"
                          type="text"
                          className="form-control"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Votre nom complet"
                          autoComplete="name"
                          autoFocus
                          required
                        />
                      </div>
                    </div>

                    {/* Email / téléphone */}
                    <div className="mb-3">
                      <label
                        htmlFor="phoneOrEmail"
                        className="form-label fw-semibold"
                      >
                        Email ou numéro de téléphone
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light">📱</span>
                        <input
                          id="phoneOrEmail"
                          type="text"
                          className="form-control"
                          value={phoneOrEmail}
                          onChange={(e) => setPhoneOrEmail(e.target.value)}
                          placeholder="Email ou téléphone"
                          autoComplete="username"
                          required
                        />
                      </div>
                    </div>

                    {/* Mot de passe */}
                    <div className="mb-3">
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
                          placeholder="Minimum 8 caractères"
                          autoComplete="new-password"
                          minLength={8}
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
                      <div className="form-text">
                        Utilisez au moins 8 caractères.
                      </div>
                    </div>

                    {/* Confirmation */}
                    <div className="mb-4">
                      <label
                        htmlFor="confirmPassword"
                        className="form-label fw-semibold"
                      >
                        Confirmer le mot de passe
                      </label>
                      <div className="input-group input-group-lg has-validation">
                        <span className="input-group-text bg-light">🔑</span>
                        <input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          className={`form-control ${passwordsMismatch ? "is-invalid" : ""
                            } ${confirmPassword && !passwordsMismatch
                              ? "is-valid"
                              : ""
                            }`}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirmez votre mot de passe"
                          autoComplete="new-password"
                          minLength={8}
                          required
                        />
                        <div className="invalid-feedback">
                          Les mots de passe ne correspondent pas.
                        </div>
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
                          Création du compte...
                        </>
                      ) : (
                        "Créer mon compte"
                      )}
                    </button>
                  </fieldset>
                </form>

                {/* Connexion */}
                <hr className="my-4" />
                <div className="text-center">
                  <p className="text-muted mb-1">Vous avez déjà un compte ?</p>
                  <Link to="/login" className="btn btn-outline-success w-100">
                    Se connecter
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

export default Register;