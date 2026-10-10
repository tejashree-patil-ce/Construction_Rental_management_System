import { useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage, getFieldErrors } from "../api/axios";
import useNow from "../hooks/useNow";
import FormField from "../components/FormField";
import PortalRentalCard from "../components/PortalRentalCard";

export default function Portal() {
  const now = useNow();

  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPhoneError("");
    setLoading(true);

    try {
      const res = await api.post("/portal/rentals", { phone: phone.trim() });
      setResult({ ...res.data.data, fetchedAt: Date.now() });
    } catch (err) {
      setResult(null);

      const fields = getFieldErrors(err);
      if (fields.phone) {
        setPhoneError(fields.phone);
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="topbar">
        <div className="brand">Maya Centring Plates</div>
        <Link className="topbar-link" to="/login">
          Admin login
        </Link>
      </header>

      <main className="container">
        <form className="card portal-form" onSubmit={handleSubmit}>
          <h2>Check your rental</h2>
          <p className="muted">
            Enter the mobile number you registered with to see your active
            rentals and the bill so far.
          </p>

          {error && <div className="alert">{error}</div>}

          <FormField
            label="Mobile number"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={phoneError}
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit mobile number"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Check my rentals"}
          </button>
        </form>

        {result &&
          (result.rentals.length === 0 ? (
            <div className="card portal-result">
              <p className="empty">
                No active rentals found for this number. If you think this is a
                mistake, please contact the shop.
              </p>
            </div>
          ) : (
            <div className="portal-result">
              <h2>Hello, {result.customerName}</h2>
              <div className="rental-grid">
                {result.rentals.map((rental, index) => (
                  <PortalRentalCard
                    key={index}
                    rental={rental}
                    now={now}
                    fetchedAt={result.fetchedAt}
                  />
                ))}
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}