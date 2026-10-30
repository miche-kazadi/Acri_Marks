import axios from "axios";

const Api = axios.create({
  baseURL: "https://acri-marks.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    // Les routes de connexion et d'inscription sont publiques.
    const isPublicAuthEndpoint =
      config.url?.includes("/auth/login/") ||
      config.url?.includes("/auth/register/");

    // N'envoyer le JWT que pour les autres requêtes.
    if (token && !isPublicAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default Api;
