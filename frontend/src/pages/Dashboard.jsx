import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeCount, setActiveCount] = useState(null);

  useEffect(() => {
    api
      .get("/rentals/active")
      .then((res) => setActiveCount(res.data.count))
      .catch(() => setActiveCount("could not load"));
  }, []);

  return (
    <div className="card">
      <h2>Welcome, {user.name}</h2>
      <p>
        Active rentals:{" "}
        <strong>{activeCount === null ? "loading..." : activeCount}</strong>
      </p>
    </div>
  );
}