import { useState } from "react";
import useFetch from "../hooks/useFetch";
import Modal from "../components/Modal";
import InventoryForm from "../components/InventoryForm";

export default function Inventory() {
  const { data: materials, loading, error, reload } = useFetch("/inventory");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (material) => {
    setEditing(material);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    reload();
  };

  return (
    <div>
      <div className="page-header">
        <h2>Inventory</h2>
        <button onClick={openAdd}>+ Add material</button>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="card table-wrap">
        {loading ? (
          <p className="empty">Loading inventory...</p>
        ) : !materials || materials.length === 0 ? (
          <p className="empty">No materials yet. Add your first one.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th className="num">Total</th>
                <th className="num">Available</th>
                <th className="num">Rented</th>
                <th className="num">Rate / day</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m._id}>
                  <td>{m.materialName}</td>
                  <td className="num">{m.totalQuantity}</td>
                  <td
                    className={m.availableQuantity === 0 ? "num stock-low" : "num"}
                  >
                    {m.availableQuantity}
                  </td>
                  <td className="num">{m.rentedQuantity}</td>
                  <td className="num">₹{m.dailyRate}</td>
                  <td>
                    <div className="actions">
                      <button className="ghost sm" onClick={() => openEdit(m)}>
                        Edit
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
          title={editing ? "Edit material" : "Add material"}
          onClose={() => setFormOpen(false)}
        >
          <InventoryForm
            material={editing}
            onSaved={handleSaved}
            onCancel={() => setFormOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}