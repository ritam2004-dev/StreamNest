import api from "./axios";

export const registerUser = (formData) =>
  api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const loginUser = async (data) => {
  const res = await api.post("/users/login", data);

  localStorage.setItem(
    "accessToken",
    res.data.data.accessToken
  );

  return res;
};

export const logoutUser = () =>
  api.post("/users/logout");

export const getCurrentUser = () =>
  api.get("/users/current-user");