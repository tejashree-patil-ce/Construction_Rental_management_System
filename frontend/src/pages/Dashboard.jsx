import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeCount, setActiveCount] = useState(null);

  useEffect(() => {
    api
      .get("/rentals/active")
      .then((res) => setActiveCount(res.data.count))
      .catch(() => setActiveCount("could not load"));
  }, []);

  return (
    <div>
      <header className="topbar">
        <strong>Construction Rental Manager</strong>
        <div>
          <span>{user.name}</span>
          <button className="secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="container">
        <div className="card">
          <h2>Welcome, {user.name}</h2>
          <p>
            Active rentals:{" "}
            <strong>{activeCount === null ? "loading..." : activeCount}</strong>
          </p>
        </div>
      </main>
    </div>
  );
}