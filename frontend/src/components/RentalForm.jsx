import { useState } from "react";
import api, { getErrorMessage, getFieldErrors } from "../api/axios";
import useFetch from "../hooks/useFetch";
import FormField from "./FormField";
import SelectField from "./SelectField";

const toNumber = (value) => (value === "" ? undefined : Number(value));

export default function RentalForm({ onSaved, onCancel }) {
  const { data: customers, loading: loadingCustomers } = useFetch("/customers");
  const { data: materials, loading: loadingMaterials } = useFetch("/inventory");

  const [form, setForm] = useState({
    customerId: "",
    materialId: "",
    quantity: "",
    startDate: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Derived: which material is currently selected?
  const selectedMaterial = materials?.find((m) => m._id === form.materialId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError("");
    setSaving(true);

    const payload = {
      customerId: form.customerId || undefined,
      materialId: form.materialId || undefined,
      quantity: toNumber(form.quantity),
    };

    // Optional: only send a start date if the admin picked one
    if (form.startDate) {
      payload.startDate = new Date(form.startDate).toISOString();
    }

    try {
      await api.post("/rentals", payload);
      onSaved();
    } catch (err) {
      const fields = getFieldErrors(err);
      setFieldErrors(fields);

      if (Object.keys(fields).length === 0) {
        setFormError(getErrorMessage(err));
      }
    } finally {
      setSaving(false);
    }
  };

  if (loadingCustomers || loadingMaterials) {
    return <p className="empty">Loading...</p>;
  }

  if (!customers?.length || !materials?.length) {
    return (
      <div>
        <p className="muted">
          You need at least one customer and one material before starting a
          rental.
        </p>
        <div className="form-actions">
          <button type="button" className="ghost" onClick={onCancel}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {formError && <div className="alert">{formError}</div>}

      <SelectField
        label="Customer"
        id="customerId"
        name="customerId"
        value={form.customerId}
        onChange={handleChange}
        error={fieldErrors.customerId}
      >
        <option value="">Select customer</option>
        {customers.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name} ({c.phone})
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Material"
        id="materialId"
        name="materialId"
        value={form.materialId}
        onChange={handleChange}
        error={fieldErrors.materialId}
      >
        <option value="">Select material</option>
        {materials.map((m) => (
          <option key={m._id} value={m._id} disabled={m.availableQuantity === 0}>
            {m.materialName} ({m.availableQuantity} available)
          </option>
        ))}
      </SelectField>

      <FormField
        label="Quantity"
        id="quantity"
        name="quantity"
        type="number"
        min="1"
        step="1"
        value={form.quantity}
        onChange={handleChange}
        error={fieldErrors.quantity}
      />
      {selectedMaterial && (
        <p className="muted">
          Available: {selectedMaterial.availableQuantity} · Rate: ₹
          {selectedMaterial.dailyRate} per plate per day
        </p>
      )}

      <FormField
        label="Start date and time (leave empty for now)"
        id="startDate"
        name="startDate"
        type="datetime-local"
        value={form.startDate}
        onChange={handleChange}
        error={fieldErrors.startDate}
      />

      <div className="form-actions">
        <button type="button" className="ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? "Starting..." : "Start rental"}
        </button>
      </div>
    </form>
  );
}