import { useState } from "react";
import api, { getErrorMessage } from "../api/axios";
import useFetch from "../hooks/useFetch";
import useNow from "../hooks/useNow";
import { formatCurrency } from "../utils/format";
import Modal from "../components/Modal";
import RentalForm from "../components/RentalForm";
import RentalCard from "../components/RentalCard";

export default function Rentals() {
  const { data: rentals, loading, error, reload, fetchedAt } = useFetch("/rentals/active");
  const now = useNow(); // one timer for the whole page

  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [returningId, setReturningId] = useState(null);

  const handleStarted = () => {
    setFormOpen(false);
    setActionError("");
    setNotice("Rental started successfully.");
    reload();
  };

  const handleReturn = async (rental, currentBill) => {
    const ok = window.confirm(
      `Return ${rental.quantity} ${rental.material?.materialName} from ${rental.customer?.name}?\n\nCurrent bill: ${formatCurrency(currentBill)}`
    );
    if (!ok) return;

    setNotice("");
    setActionError("");
    setReturningId(rental._id);

    try {
      const res = await api.put(`/rentals/${rental._id}/return`);
      const final = res.data.data.billing;

      setNotice(
        `Returned. Final bill: ${formatCurrency(final.totalAmount)} for ${final.billedDays} billed day(s).`
      );
      reload();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Active rentals</h2>
        <button onClick={() => setFormOpen(true)}>+ Start rental</button>
      </div>

      {notice && <div className="notice">{notice}</div>}
      {error && <div className="alert">{error}</div>}
      {actionError && <div className="alert">{actionError}</div>}

      {loading ? (
        <p className="empty">Loading rentals...</p>
      ) : !rentals || rentals.length === 0 ? (
        <div className="card">
          <p className="empty">No active rentals right now.</p>
        </div>
      ) : (
        <div className="rental-grid">
          {rentals.map((rental) => (
            <RentalCard
              key={rental._id}
              rental={rental}
              now={now}
              fetchedAt={fetchedAt}
              returning={returningId === rental._id}
              onReturn={handleReturn}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <Modal title="Start rental" onClose={() => setFormOpen(false)}>
          <RentalForm onSaved={handleStarted} onCancel={() => setFormOpen(false)} />
        </Modal>
      )}
    </div>
  );
}