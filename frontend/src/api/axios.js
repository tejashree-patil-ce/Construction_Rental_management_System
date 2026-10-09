import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Runs before EVERY request: attach the token if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Runs after EVERY response: if the token was rejected, log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = localStorage.getItem("token");
    if (error.response?.status === 401 && hadToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Turns any API error into a readable message for the screen
export const getErrorMessage = (error) => {
  if (!error.response) {
    return "Cannot reach the server. Please check that the backend is running.";
  }

  const details = error.response.data?.error?.details;
  if (details?.length) {
    return details.map((d) => d.message).join(". ");
  }

  return error.response.data?.message || "Something went wrong. Please try again.";
};

// Turns validation details into { fieldName: "message" } for forms
export const getFieldErrors = (error) => {
  const details = error.response?.data?.error?.details;
  const fields = {};

  if (Array.isArray(details)) {
    details.forEach((d) => {
      if (d.field && !fields[d.field]) {
        fields[d.field] = d.message;
      }
    });
  }

  return fields;
};

export default api;