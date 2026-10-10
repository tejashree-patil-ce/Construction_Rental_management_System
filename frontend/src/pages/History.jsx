import { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { formatCurrency, formatDateTime } from "../utils/format";

export default function History() {
  const { data: rentals, loading, error } = useFetch("/rentals?status=returned");
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const visible = (rentals ?? []).filter(
    (r) =>
      r.customer?.name.toLowerCase().includes(query) ||
      r.material?.materialName.toLowerCase().includes(query)
  );

  // Add up the totals of the rows currently shown
  const totalBilled = visible.reduce((sum, r) => sum + (r.totalAmount ?? 0), 0);

  return (
    <div>
      <div className="page-header">
        <h2>Rental history</h2>
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search by customer or material"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="alert">{error}</div>}

      {!loading && !error && (
        <p className="muted">
          {visible.length} completed rental(s) · Total billed:{" "}
          <strong>{formatCurrency(totalBilled)}</strong>
        </p>
      )}

      <div className="card table-wrap">
        {loading ? (
          <p className="empty">Loading history...</p>
        ) : visible.length === 0 ? (
          <p className="empty">
            {rentals?.length ? "Nothing matches your search." : "No completed rentals yet."}
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Material</th>
                <th className="num">Qty</th>
                <th>Started</th>
                <th>Returned</th>
                <th className="num">Days</th>
                <th className="num">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r._id}>
                  <td>{r.customer?.name}</td>
                  <td>{r.material?.materialName}</td>
                  <td className="num">{r.quantity}</td>
                  <td>{formatDateTime(r.startDate)}</td>
                  <td>{formatDateTime(r.returnDate)}</td>
                  <td className="num">{r.billedDays}</td>
                  <td className="num">{formatCurrency(r.totalAmount)}</td>
                  <td>
                    <div className="actions">
                      <Link className="link-btn" to={`/invoice/${r._id}`}>
                        Invoice
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}