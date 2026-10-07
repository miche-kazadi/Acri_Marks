import { useState } from "react";
import AuthService from "../../services/AuthService.ts";

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
    <div>
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="phoneOrEmail">
            Email ou numéro de téléphone
          </label>

          <input
            id="phoneOrEmail"
            type="text"
            value={phoneOrEmail}
            onChange={(event) =>
              setPhoneOrEmail(event.target.value)
            }
            placeholder="Email ou numéro de téléphone"
            required
          />
        </div>

        <div>
          <label htmlFor="password">
            Mot de passe
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Mot de passe"
            required
          />
        </div>

        {error && (
          <p>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

      </form>
    </div>
  );
}

export default Login;