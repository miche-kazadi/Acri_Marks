import Api from "./Api";

const login = async (
  phoneOrEmail: string,
  password: string
) => {
  // 1. Connexion
  const response = await Api.post("/auth/login/", {
    phone_or_email: phoneOrEmail,
    password: password,
  });

  const data = response.data;

  // 2. Sauvegarder les tokens
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);

  // 3. Récupérer le profil de l'utilisateur connecté
  const profileResponse = await Api.get("/profile/");

  const profile = profileResponse.data;

  // 4. Sauvegarder le rôle
  localStorage.setItem("user_role", profile.role);
  localStorage.setItem("is_staff", profile.is_staff.toString());
  localStorage.setItem("is_superuser", profile.is_superuser.toString());

  return {
    ...data,
    profile,
  };
};

const register = async (
  fullName: string,
  role: string,
  phoneOrEmail: string,
  password: string
) => {
  const response = await Api.post("/auth/register/", {
    full_name: fullName,
    role: role,
    phone_or_email: phoneOrEmail,
    password: password,
  });

  return response.data;
};

const getProfile = async () => {
  const response = await Api.get("/profile/");

  return response.data;
};

const updateProfile = async (payload: {
  full_name?: string;
  phone_or_email?: string;
}) => {
  const response = await Api.patch("/profile/", payload);
  return response.data;
};

const changePassword = async (oldPassword: string, newPassword: string) => {
  const response = await Api.post("/profile/password/", {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return response.data;
};
const updateAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await Api.patch("/profile/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const removeAvatar = async () => {
  const response = await Api.patch("/profile/", { avatar: null });
  return response.data;
};

export default {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  updateAvatar,
  removeAvatar,
};