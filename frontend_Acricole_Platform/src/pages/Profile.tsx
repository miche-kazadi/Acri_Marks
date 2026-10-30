import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/AuthService";

interface Profile {
  id: number;
  full_name: string;
  phone_or_email: string;
  role: string;
  avatar: string | null;
  is_staff: boolean;
  is_superuser: boolean;
}

const MAX_SIZE = 2 * 1024 * 1024; // 2 Mo
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function flattenErrors(err: any): string {
  if (!err?.response) return "Impossible de contacter le serveur.";
  const d = err.response.data;
  if (typeof d === "string") return d;
  if (d?.detail) return d.detail;
  if (d?.error) return d.error;
  if (d && typeof d === "object") {
    return Object.values(d).flat().map(String).join(" ");
  }
  return "Une erreur est survenue.";
}

function roleLabel(p: Profile) {
  if (p.is_superuser) return "Administrateur";
  if (p.role === "PRODUCTEUR") return "Producteur";
  if (p.role === "ACHETEUR") return "Acheteur";
  return "—";
}

function homePath(p: Profile) {
  if (p.is_superuser) return "/admin";
  if (p.role === "PRODUCTEUR") return "/producteur";
  return "/acheteur";
}

function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [loadError, setLoadError] = useState("");

  const [saving, setSaving] = useState(false);
  const [infoError, setInfoError] = useState("");
  const [infoSuccess, setInfoSuccess] = useState("");

  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarSuccess, setAvatarSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  useEffect(() => {
    AuthService.getProfile()
      .then((p: Profile) => {
        setProfile(p);
        setFullName(p.full_name);
        setContact(p.phone_or_email);
      })
      .catch((e: any) => setLoadError(flattenErrors(e)));
  }, []);

  async function saveInfo(e: FormEvent) {
    e.preventDefault();
    setInfoError("");
    setInfoSuccess("");
    setSaving(true);
    try {
      const updated: Profile = await AuthService.updateProfile({
        full_name: fullName.trim(),
        phone_or_email: contact.trim(),
      });
      setProfile(updated);
      setInfoSuccess("Vos informations ont été mises à jour.");
    } catch (err: any) {
      setInfoError(flattenErrors(err));
    } finally {
      setSaving(false);
    }
  }

  async function onAvatarSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permet de rechoisir le même fichier
    if (!file) return;

    setAvatarError("");
    setAvatarSuccess("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setAvatarError("Format non accepté. Utilisez JPG, PNG ou WebP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setAvatarError("L'image ne doit pas dépasser 2 Mo.");
      return;
    }

    setAvatarBusy(true);
    try {
      const updated: Profile = await AuthService.updateAvatar(file);
      setProfile(updated);
      setAvatarSuccess("Photo de profil mise à jour.");
    } catch (err: any) {
      setAvatarError(flattenErrors(err));
    } finally {
      setAvatarBusy(false);
    }
  }

  async function onAvatarRemove() {
    if (!window.confirm("Supprimer votre photo de profil ?")) return;
    setAvatarError("");
    setAvatarSuccess("");
    setAvatarBusy(true);
    try {
      const updated: Profile = await AuthService.removeAvatar();
      setProfile(updated);
      setAvatarSuccess("Photo de profil supprimée.");
    } catch (err: any) {
      setAvatarError(flattenErrors(err));
    } finally {
      setAvatarBusy(false);
    }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (newPassword !== confirmPassword) {
      setPwdError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setPwdSaving(true);
    try {
      await AuthService.changePassword(oldPassword, newPassword);
      setPwdSuccess("Mot de passe modifié avec succès.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwdError(flattenErrors(err));
    } finally {
      setPwdSaving(false);
    }
  }

  if (loadError) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger">{loadError}</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="container py-5">
        <p className="text-muted">Chargement…</p>
      </main>
    );
  }

  const initial = (profile.full_name || profile.phone_or_email || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <main className="container py-4" style={{ maxWidth: 760 }}>
      <Link to={homePath(profile)} className="btn btn-link text-success px-0 mb-3">
        ← Retour à mon espace
      </Link>

      {/* En-tête du profil avec photo */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Photo de profil"
                className="rounded-circle border"
                style={{ width: 96, height: 96, objectFit: "cover" }}
              />
            ) : (
              <div
                className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 96, height: 96, fontSize: 40 }}
              >
                {initial}
              </div>
            )}

            <div className="flex-grow-1">
              <h1 className="h4 fw-bold mb-1">{profile.full_name || "Sans nom"}</h1>
              <p className="text-muted mb-1">{profile.phone_or_email}</p>
              <span className={`badge ${profile.is_superuser ? "text-bg-dark" : "text-bg-success"}`}>
                {roleLabel(profile)}
              </span>
            </div>
          </div>

          <hr />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="d-none"
            onChange={onAvatarSelected}
          />

          <div className="d-flex gap-2 flex-wrap">
            <button
              type="button"
              className="btn btn-success btn-sm"
              disabled={avatarBusy}
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarBusy ? "Envoi…" : profile.avatar ? "📷 Changer la photo" : "📷 Ajouter une photo"}
            </button>
            {profile.avatar && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                disabled={avatarBusy}
                onClick={onAvatarRemove}
              >
                Supprimer la photo
              </button>
            )}
          </div>
          <div className="form-text">JPG, PNG ou WebP, 2 Mo maximum.</div>

          {avatarError && <div className="alert alert-danger mt-3 mb-0">{avatarError}</div>}
          {avatarSuccess && <div className="alert alert-success mt-3 mb-0">{avatarSuccess}</div>}
        </div>
      </div>

      {/* Informations personnelles */}
      <section className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h2 className="h5 mb-3">Mes informations</h2>

          {infoError && <div className="alert alert-danger">{infoError}</div>}
          {infoSuccess && <div className="alert alert-success">{infoSuccess}</div>}

          <form onSubmit={saveInfo}>
            <div className="mb-3">
              <label htmlFor="p-name" className="form-label fw-semibold">Nom complet</label>
              <input
                id="p-name"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={150}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="p-contact" className="form-label fw-semibold">
                Email ou numéro de téléphone
              </label>
              <input
                id="p-contact"
                className="form-control"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                maxLength={150}
              />
              <div className="form-text">
                C'est l'identifiant que vous utilisez pour vous connecter.
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Type de compte</label>
              <input className="form-control" value={roleLabel(profile)} disabled />
              <div className="form-text">Le type de compte ne peut pas être modifié.</div>
            </div>

            <button className="btn btn-success" disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer les modifications"}
            </button>
          </form>
        </div>
      </section>

      {/* Mot de passe */}
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h2 className="h5 mb-3">Changer mon mot de passe</h2>

          {pwdError && <div className="alert alert-danger">{pwdError}</div>}
          {pwdSuccess && <div className="alert alert-success">{pwdSuccess}</div>}

          <form onSubmit={savePassword}>
            <div className="mb-3">
              <label htmlFor="p-old" className="form-label fw-semibold">Ancien mot de passe</label>
              <input
                id="p-old"
                type="password"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="p-new" className="form-label fw-semibold">Nouveau mot de passe</label>
              <input
                id="p-new"
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="p-confirm" className="form-label fw-semibold">
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="p-confirm"
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            <button className="btn btn-outline-success" disabled={pwdSaving}>
              {pwdSaving ? "Modification…" : "Changer le mot de passe"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;