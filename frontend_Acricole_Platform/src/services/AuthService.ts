import Api from "./Api";

const login = async (
  phoneOrEmail: string,
  password: string
) => {
  const response = await Api.post("/auth/login/", {
    phone_or_email: phoneOrEmail,
    password: password,
  });

  return response.data;
};

export default {
  login,
};