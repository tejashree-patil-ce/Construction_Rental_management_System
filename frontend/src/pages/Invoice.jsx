import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { formatCurrency, formatDateTime } from "../utils/format";

export default function Invoice() {
  const { id } = useParams();
  const { data: rental, loading, error } = useFetch(`/rentals/${id}`);

  if (loading) return <p className="empty">Loading invoice...</p>;
  if (error) return <div className="alert">{error}</div>;

  if (rental.status !== "returned") {
    return (
      <div className="card">
        <p>An invoice is created once the material has been returned.</p>
        <Link to="/rentals">← Back to active rentals</Link>
      </div>
    );
  }

  const invoiceNo = `INV-${rental._id.slice(-6).toUpperCase()}`;

  return (
    <div>
      <div className="invoice-actions no-print">
        <Link to="/history">← Back to history</Link>
        <button onClick={() => window.print()}>Print invoice</button>
      </div>

      <div className="card invoice">
        <div className="invoice-head">
          <div>
            <h1>MAYA CENTRING PLATES</h1>
            <p className="muted">Construction material rental</p>
            {/* Add your shop address and phone number here */}
          </div>
          <div className="invoice-meta">
            <strong>{invoiceNo}</strong>
            <p>Date: {formatDateTime(rental.returnDate)}</p>
          </div>
        </div>

        <hr />

        <div className="invoice-parties">
          <small className="muted">BILLED TO</small>
          <p>
            <strong>{rental.customer?.name}</strong>
          </p>
          <p>{rental.customer?.phone}</p>
          {rental.customer?.address && <p>{rental.customer.address}</p>}
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th className="num">Qty</th>
              <th className="num">Rate / day</th>
              <th className="num">Days</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{rental.material?.materialName}</td>
              <td className="num">{rental.quantity}</td>
              <td className="num">{formatCurrency(rental.dailyRate)}</td>
              <td className="num">{rental.billedDays}</td>
              <td className="num">{formatCurrency(rental.totalAmount)}</td>
            </tr>
          </tbody>
        </table>

        <div className="invoice-total">
          <span>Total</span>
          <span>{formatCurrency(rental.totalAmount)}</span>
        </div>

        <p className="muted">
          Rented: {formatDateTime(rental.startDate)} → Returned:{" "}
          {formatDateTime(rental.returnDate)} ({rental.billing.elapsedDays.toFixed(2)}{" "}
          days used, billed as {rental.billedDays} day(s))
        </p>
        <p className="muted center">Thank you for your business.</p>
      </div>
    </div>
  );
}