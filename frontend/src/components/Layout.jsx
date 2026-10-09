import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="topbar">
        <div className="brand">Maya Centring Plates</div>

        <nav className="nav">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/rentals">Rentals</NavLink>
          <NavLink to="/customers">Customers</NavLink>
          <NavLink to="/inventory">Inventory</NavLink>
        </nav>

        <div className="topbar-right">
          <span>{user.name}</span>
          <button className="secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}