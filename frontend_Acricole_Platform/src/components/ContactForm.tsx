
import { useState, type FormEvent } from "react";
import Api from "../services/Api";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await Api.post("/contact/", form);

      setSuccess(
        response.data.message ||
          "Votre message a été traité en mode développement.",
      );

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      console.error("Erreur lors de l'envoi du message :", err);

      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "error" in err.response.data &&
        typeof err.response.data.error === "string"
          ? err.response.data.error
          : "Impossible d'envoyer votre message. Vérifiez votre connexion et réessayez.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {success && (
        <div className="alert alert-success" role="status">
          {success}
          <p className="small mb-0 mt-1">
            En développement, le message est enregistré dans le terminal
            Django et aucun e-mail réel n'est envoyé.
          </p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="contact-name" className="form-label">
          Nom complet
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          className="form-control"
          value={form.name}
          onChange={handleChange}
          maxLength={100}
          autoComplete="name"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="contact-email" className="form-label">
          Adresse e-mail
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="contact-subject" className="form-label">
          Sujet
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          className="form-control"
          value={form.subject}
          onChange={handleChange}
          maxLength={150}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="contact-message" className="form-label">
          Votre message
        </label>
        <textarea
          id="contact-message"
          name="message"
          className="form-control"
          rows={5}
          value={form.message}
          onChange={handleChange}
          minLength={10}
          maxLength={3000}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-success w-100"
        disabled={loading}
      >
        {loading ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}

export default ContactForm;
