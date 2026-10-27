import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../services/Api";
import AdminService, {
  type AdminStats,
  type AdminUser,
  type Paginated,
} from "../../services/adminService";

type Tab = "stats" | "users" | "products" | "orders" | "admins";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "stats", label: "Statistiques", icon: "📊" },
  { id: "users", label: "Utilisateurs", icon: "👥" },
  { id: "products", label: "Produits", icon: "🌾" },
  { id: "orders", label: "Commandes", icon: "📦" },
  { id: "admins", label: "Administrateurs", icon: "🛡️" },
];

const PRODUCT_STATUS = ["DRAFT", "OPEN", "SOLD_OUT", "COMPLETED", "CANCELLED"];
const ORDER_STATUS = ["PENDING", "CONFIRMED", "READY", "COMPLETED", "CANCELLED"];

function errMsg(err: any): string {
  const d = err?.response?.data;
  if (!err?.response) return "Impossible de contacter le serveur.";
  if (typeof d === "string") return d;
  if (d?.error) return d.error;
  if (d?.detail) return d.detail;
  return "Une erreur est survenue.";
}

/* ---------- Pagination ---------- */
function Pager({
  page,
  data,
  onChange,
}: {
  page: number;
  data: Paginated<any> | null;
  onChange: (p: number) => void;
}) {
  if (!data) return null;
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <span className="text-muted small">{data.count} résultat(s)</span>
      <div className="btn-group">
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={!data.previous}
          onClick={() => onChange(page - 1)}
        >
          ← Précédent
        </button>
        <button className="btn btn-outline-secondary btn-sm" disabled>
          Page {page}
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={!data.next}
          onClick={() => onChange(page + 1)}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

/* ---------- Statistiques ---------- */
function StatsTab() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    AdminService.getStats().then(setStats).catch((e) => setError(errMsg(e)));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return <p className="text-muted">Chargement…</p>;

  const cards = [
    { label: "Utilisateurs", value: stats.users.total, icon: "👥" },
    { label: "Producteurs", value: stats.users.producers, icon: "🌾" },
    { label: "Acheteurs", value: stats.users.buyers, icon: "🛒" },
    { label: "Produits", value: stats.products.total, icon: "📋" },
    { label: "Produits ouverts", value: stats.products.open, icon: "🟢" },
    { label: "Produits épuisés", value: stats.products.sold_out, icon: "🔴" },
    { label: "Commandes", value: stats.orders.total, icon: "📦" },
    { label: "En attente", value: stats.orders.pending, icon: "⏳" },
    { label: "Confirmées", value: stats.orders.confirmed, icon: "✅" },
    { label: "Terminées", value: stats.orders.completed, icon: "🏁" },
  ];

  return (
    <div className="row g-3">
      {cards.map((c) => (
        <div className="col-6 col-lg-3" key={c.label}>
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <span className="text-muted small">{c.label}</span>
                <span className="fs-4">{c.icon}</span>
              </div>
              <p className="display-6 fw-bold mb-0">{c.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Utilisateurs ---------- */
function UsersTab() {
  const [data, setData] = useState<Paginated<AdminUser> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    AdminService.getUsers({ page, search: search || undefined, role: role || undefined })
      .then((d) => {
        setData(d);
        setError("");
      })
      .catch((e) => setError(errMsg(e)));
  }, [page, search, role]);

  useEffect(load, [load]);

  async function toggle(u: AdminUser) {
    try {
      await AdminService.setUserActive(u.id, !u.is_active);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  async function remove(u: AdminUser) {
    if (!window.confirm(`Supprimer définitivement ${u.full_name || u.phone_or_email} ?`)) return;
    try {
      await AdminService.deleteUser(u.id);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  return (
    <>
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Rechercher un nom, email ou téléphone"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={role}
            onChange={(e) => {
              setPage(1);
              setRole(e.target.value);
            }}
          >
            <option value="">Tous les rôles</option>
            <option value="PRODUCTEUR">Producteurs</option>
            <option value="ACHETEUR">Acheteurs</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Contact</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.results.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.full_name || "—"}</td>
                <td>{u.phone_or_email || "—"}</td>
                <td>
                  {u.is_superuser ? (
                    <span className="badge text-bg-dark">Admin</span>
                  ) : (
                    <span className="badge text-bg-secondary">{u.role || "—"}</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${u.is_active ? "text-bg-success" : "text-bg-danger"}`}>
                    {u.is_active ? "Actif" : "Désactivé"}
                  </span>
                </td>
                <td className="text-end">
                  {!u.is_superuser && (
                    <>
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => toggle(u)}
                      >
                        {u.is_active ? "Désactiver" : "Activer"}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(u)}
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager page={page} data={data} onChange={setPage} />
    </>
  );
}

/* ---------- Produits ---------- */
function ProductsTab() {
  const [data, setData] = useState<Paginated<any> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    AdminService.getProducts({
      page,
      search: search || undefined,
      status: status || undefined,
      category: category || undefined,
    })
      .then((d) => {
        setData(d);
        setError("");
      })
      .catch((e) => setError(errMsg(e)));
  }, [page, search, status, category]);

  useEffect(load, [load]);

  async function changeStatus(id: number, newStatus: string) {
    try {
      await AdminService.updateProduct(id, { status: newStatus });
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  async function remove(p: any) {
    if (!window.confirm(`Supprimer le produit « ${p.title} » ?`)) return;
    try {
      await AdminService.deleteProduct(p.id);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  return (
    <>
      <div className="row g-2 mb-3">
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Rechercher un produit ou un producteur"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">Tous les statuts</option>
            {PRODUCT_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
          >
            <option value="">Toutes catégories</option>
            <option value="AGRICULTURE">Agriculture</option>
            <option value="PISCICULTURE">Pisciculture</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Produit</th>
              <th>Producteur</th>
              <th>Catégorie</th>
              <th>Stock</th>
              <th>Prix</th>
              <th>Statut</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.results.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.title}</td>
                <td>{p.producer_name}</td>
                <td>{p.category}</td>
                <td>
                  {p.quantity_available} / {p.quantity_total} {p.unit}
                </td>
                <td>{p.price_per_unit}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={p.status}
                    onChange={(e) => changeStatus(p.id, e.target.value)}
                  >
                    {PRODUCT_STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager page={page} data={data} onChange={setPage} />
    </>
  );
}

/* ---------- Commandes ---------- */
function OrdersTab() {
  const [data, setData] = useState<Paginated<any> | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    AdminService.getOrders({ page, status: status || undefined })
      .then((d) => {
        setData(d);
        setError("");
      })
      .catch((e) => setError(errMsg(e)));
  }, [page, status]);

  useEffect(load, [load]);

  async function changeStatus(id: number, newStatus: string) {
    try {
      await AdminService.updateOrderStatus(id, newStatus);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  return (
    <>
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">Tous les statuts</option>
            {ORDER_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>N°</th>
              <th>Acheteur</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.results.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.buyer_name}</td>
                <td>{o.product_title}</td>
                <td>{o.quantity}</td>
                <td>{o.total_price}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={o.status}
                    onChange={(e) => changeStatus(o.id, e.target.value)}
                  >
                    {ORDER_STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager page={page} data={data} onChange={setPage} />
    </>
  );
}

/* ---------- Créer un administrateur (ton code d'origine) ---------- */
function AdminsTab() {
  const [fullName, setFullName] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await Api.post("/admin/create/", {
        full_name: fullName.trim(),
        phone_or_email: phoneOrEmail.trim().toLowerCase(),
        password,
      });
      setSuccess(response.data.message || "Administrateur créé avec succès.");
      setFullName("");
      setPhoneOrEmail("");
      setPassword("");
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setError("Accès refusé : seuls les superadministrateurs peuvent créer un administrateur.");
      } else if (err?.response?.data) {
        setError(Object.values(err.response.data).flat().map(String).join(" "));
      } else {
        setError("Impossible de contacter le serveur.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card border-0 shadow-sm" style={{ maxWidth: 560 }}>
      <div className="card-body p-4">
        <h2 className="h5 mb-3">Créer un administrateur</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="admin-full-name" className="form-label">Nom complet</label>
            <input
              id="admin-full-name"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              maxLength={150}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="admin-contact" className="form-label">E-mail ou téléphone</label>
            <input
              id="admin-contact"
              className="form-control"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              required
              maxLength={150}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="admin-password" className="form-label">
              Mot de passe (8 caractères minimum)
            </label>
            <input
              id="admin-password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <button className="btn btn-success" disabled={loading}>
            {loading ? "Création…" : "Créer le compte administrateur"}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ---------- Page principale ---------- */
function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("stats");
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/login", { replace: true });
  }

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="badge text-bg-dark mb-2">Espace administrateur</span>
          <h1 className="h3 fw-bold mb-0">Administration Agri_Mark</h1>
        </div>
        <button className="btn btn-outline-secondary" onClick={logout}>
          Se déconnecter
        </button>
      </div>

      <ul className="nav nav-pills mb-4 flex-wrap gap-1">
        {TABS.map((t) => (
          <li className="nav-item" key={t.id}>
            <button
              className={`nav-link ${tab === t.id ? "active bg-success" : "text-success"}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          </li>
        ))}
      </ul>

      {tab === "stats" && <StatsTab />}
      {tab === "users" && <UsersTab />}
      {tab === "products" && <ProductsTab />}
      {tab === "orders" && <OrdersTab />}
      {tab === "admins" && <AdminsTab />}
    </main>
  );
}

export default AdminDashboard;