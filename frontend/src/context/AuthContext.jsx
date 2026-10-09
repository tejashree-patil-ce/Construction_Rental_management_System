import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const readSavedUser = () => {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  // Function form: runs only once, on first render
  const [user, setUser] = useState(readSavedUser);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    const { token, ...userInfo } = data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);