import { liveBill } from "../utils/billing";
import { formatCurrency, formatDateTime } from "../utils/format";

export default function PortalRentalCard({ rental, now, fetchedAt }) {
  const bill = liveBill({
    baseElapsedDays: rental.billing.elapsedDays,
    fetchedAt,
    now,
    quantity: rental.quantity,
    dailyRate: rental.dailyRate,
  });

  return (
    <div className="card rental-card">
      <div className="rental-top">
        <h3>{rental.material}</h3>
        <span className="badge-active">ACTIVE</span>
      </div>

      <p>
        Qty {rental.quantity} · {formatCurrency(rental.dailyRate)} / plate / day
      </p>
      <p className="muted">Started: {formatDateTime(rental.startDate)}</p>

      <div className="stats">
        <div>
          <small>Elapsed</small>
          <strong>{bill.elapsedDays.toFixed(5)} days</strong>
        </div>
        <div>
          <small>Billed</small>
          <strong>{bill.billedDays} days</strong>
        </div>
        <div>
          <small>Current bill</small>
          <strong className="bill">{formatCurrency(bill.totalAmount)}</strong>
        </div>
      </div>
    </div>
  );
}