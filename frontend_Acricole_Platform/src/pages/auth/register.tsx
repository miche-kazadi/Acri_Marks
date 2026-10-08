import { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/AuthService";


function Register() {
  const [fullName, setFullName] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [role, setRole] = useState("ACHETEUR");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const data = await AuthService.register(
        fullName,
        role,
        phoneOrEmail,
        password
      );

      console.log("Inscription réussie :", data);

      setSuccess(
        "Votre compte a été créé avec succès !"
      );

      setFullName("");
      setPhoneOrEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error: any) {
      console.error("Erreur inscription :", error);

      if (error.response?.data) {
        const data = error.response.data;

        if (typeof data === "string") {
          setError(data);
        } else if (data.detail) {
          setError(data.detail);
        } else if (data.phone_or_email) {
          setError(data.phone_or_email[0]);
        } else if (data.full_name) {
          setError(data.full_name[0]);
        } else if (data.password) {
          setError(data.password[0]);
        } else if (data.role) {
          setError(data.role[0]);
        } else {
          setError("Impossible de créer le compte.");
        }
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
        <div className="col-12 col-md-8 col-lg-6">

          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">

              <div className="text-center mb-4">
                <h1 className="fw-bold">
                  🌾 Agri_Mark
                </h1>

                <p className="text-muted mb-0">
                  Créez votre compte
                </p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label
                    htmlFor="fullName"
                    className="form-label fw-semibold"
                  >
                    Nom complet
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    placeholder="Votre nom complet"
                    required
                  />
                </div>

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
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Je suis :
                  </label>

                  <div className="row g-2">

                    <div className="col-3">
                      <input
                        type="radio"
                        className="btn-check"
                        name="role"
                        id="acheteur"
                        value="ACHETEUR"
                        checked={role === "ACHETEUR"}
                        onChange={(event) => setRole(event.target.value)}
                      />

                      <label
                        className="btn btn-outline-success "
                        htmlFor="acheteur"
                      >
                        🛒
                        <br />
                        Acheteur
                      </label>
                    </div>

                    <div className="col-3">
                      <input
                        type="radio"
                        className="btn-check"
                        name="role"
                        id="producteur"
                        value="PRODUCTEUR"
                        checked={role === "PRODUCTEUR"}
                        onChange={(event) => setRole(event.target.value)}
                      />

                      <label
                        className="btn btn-outline-success"
                        htmlFor="producteur"
                      >
                        🌾
                        <br />
                        Producteur
                      </label>
                    </div>

                  </div>
                </div>

                <div className="mb-3">
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
                    placeholder="Minimum 8 caractères"
                    minLength={8}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="form-label fw-semibold"
                  >
                    Confirmer le mot de passe
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirmez votre mot de passe"
                    minLength={8}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 py-2"
                  disabled={loading}
                >
                  {loading
                    ? "Création du compte..."
                    : "Créer mon compte"}
                </button>

              </form>

              <div className="text-center mt-4">
                <span className="text-muted">
                  Vous avez déjà un compte ?
                </span>

                <Link
                  to="/login"
                  className="btn btn-link text-decoration-none"
                >
                  Se connecter
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;