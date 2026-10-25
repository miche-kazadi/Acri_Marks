import { useState } from "react";
import ProductService from "../../services/ProductService";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

const initialForm = {
  title: "",
  category: "AGRICULTURE" as "AGRICULTURE" | "PISCICULTURE",
  quantity_total: "",
  unit: "kg",
  price_per_unit: "",
  available_date: "",
  location: "",
  description: "",
};

function CreateProduct() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const product = await ProductService.createProduct({
        ...form,
        quantity_total: Number(form.quantity_total),
        price_per_unit: Number(form.price_per_unit),
      });

      setMessage(`Produit « ${product.title} » créé avec succès !`);
      setForm(initialForm);
    } catch (err) {
      console.error("Erreur de création du produit :", err);

      const responseData = axios.isAxiosError(err)
        ? err.response?.data
        : undefined;
      if (responseData && typeof responseData === "object") {
        const details = Object.entries(responseData)
          .map(([field, value]) => {
            const description = Array.isArray(value)
              ? value.join(", ")
              : String(value);

            return `${field} : ${description}`;
          })
          .join(" | ");

        setError(details || "Impossible de créer le produit.");
      } else {
        setError("Impossible de contacter le serveur. Vérifie que Django fonctionne.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2>🌾 Publier un produit</h2>
        <p className="text-muted">
          Présente ta récolte ou ta production piscicole aux acheteurs.
        </p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card shadow-sm">
        <div className="card-body p-4">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Nom du produit *
            </label>
            <input
              id="title"
              name="title"
              className="form-control"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={200}
              placeholder="Ex. Maïs blanc frais"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Catégorie *
            </label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="AGRICULTURE">Agriculture</option>
              <option value="PISCICULTURE">Pisciculture</option>
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="quantity_total" className="form-label">
                Quantité totale *
              </label>
              <input
                id="quantity_total"
                name="quantity_total"
                type="number"
                min="0.01"
                step="0.01"
                className="form-control"
                value={form.quantity_total}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="unit" className="form-label">
                Unité *
              </label>
              <select
                id="unit"
                name="unit"
                className="form-select"
                value={form.unit}
                onChange={handleChange}
                required
              >
                <option value="kg">Kilogramme (kg)</option>
                <option value="tonne">Tonne</option>
                <option value="sac">Sac</option>
                <option value="pièce">Pièce</option>
                <option value="litre">Litre</option>
                <option value="caisse">Caisse</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="price_per_unit" className="form-label">
              Prix par unité (CDF) *
            </label>
            <input
              id="price_per_unit"
              name="price_per_unit"
              type="number"
              min="0.01"
              step="0.01"
              className="form-control"
              value={form.price_per_unit}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="available_date" className="form-label">
              Date de disponibilité *
            </label>
            <input
              id="available_date"
              name="available_date"
              type="date"
              className="form-control"
              value={form.available_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Localisation *
            </label>
            <input
              id="location"
              name="location"
              className="form-control"
              value={form.location}
              onChange={handleChange}
              required
              maxLength={200}
              placeholder="Ex. Kimpese, Kongo Central"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Décris la qualité, la variété ou les conditions de récolte..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? "Publication en cours..." : "Publier le produit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProduct;