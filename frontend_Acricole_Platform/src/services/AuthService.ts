import Api from "./Api";

const login = async (
  phoneOrEmail: string,
  password: string
) => {
  const response = await Api.post("/auth/login/", {
    phone_or_email: phoneOrEmail,
    password: password,
  });

  const data = response.data;

  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);

  return data;
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

export default {
  login,
  register,
  getProfile
};