import { useState } from "react";
import api, { getErrorMessage } from "../api/axios";
import useFetch from "../hooks/useFetch";
import Modal from "../components/Modal";
import CustomerForm from "../components/CustomerForm";

export default function Customers() {
  const { data: customers, loading, error, reload } = useFetch("/customers");

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = adding a new one
  const [actionError, setActionError] = useState("");

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (customer) => {
    setEditing(customer);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    reload();
  };

  const handleDelete = async (customer) => {
    if (!window.confirm(`Delete ${customer.name}?`)) return;

    setActionError("");
    try {
      await api.delete(`/customers/${customer._id}`);
      reload();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  // Derived data: calculated on every render, not stored in state
  const query = search.trim().toLowerCase();
  const visible = (customers ?? []).filter(
    (c) => c.name.toLowerCase().includes(query) || c.phone.includes(query)
  );

  return (
    <div>
      <div className="page-header">
        <h2>Customers</h2>
        <button onClick={openAdd}>+ Add customer</button>
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="alert">{error}</div>}
      {actionError && <div className="alert">{actionError}</div>}

      <div className="card table-wrap">
        {loading ? (
          <p className="empty">Loading customers...</p>
        ) : visible.length === 0 ? (
          <p className="empty">
            {customers?.length ? "No customers match your search." : "No customers yet."}
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.address}</td>
                  <td>
                    <div className="actions">
                      <button className="ghost sm" onClick={() => openEdit(c)}>
                        Edit
                      </button>
                      <button className="danger sm" onClick={() => handleDelete(c)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {formOpen && (
        <Modal
          title={editing ? "Edit customer" : "Add customer"}
          onClose={() => setFormOpen(false)}
        >
          <CustomerForm
            customer={editing}
            onSaved={handleSaved}
            onCancel={() => setFormOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}