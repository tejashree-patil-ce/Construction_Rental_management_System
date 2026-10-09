import { useState } from "react";
import api, { getErrorMessage, getFieldErrors } from "../api/axios";
import FormField from "./FormField";

// HTML inputs always give text. The API wants real numbers.
// Empty box -> undefined, so the API reports it as "required".
const toNumber = (value) => (value === "" ? undefined : Number(value));

export default function InventoryForm({ material, onSaved, onCancel }) {
  const isEdit = Boolean(material);

  const [form, setForm] = useState({
    materialName: material?.materialName ?? "",
    totalQuantity: material?.totalQuantity ?? "",
    dailyRate: material?.dailyRate ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError("");
    setSaving(true);

    const payload = {
      materialName: form.materialName,
      totalQuantity: toNumber(form.totalQuantity),
      dailyRate: toNumber(form.dailyRate),
    };

    try {
      if (isEdit) {
        await api.put(`/inventory/${material._id}`, payload);
      } else {
        await api.post("/inventory", payload);
      }
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

  return (
    <form onSubmit={handleSubmit}>
      {formError && <div className="alert">{formError}</div>}

      <FormField
        label="Material name"
        id="materialName"
        name="materialName"
        value={form.materialName}
        onChange={handleChange}
        error={fieldErrors.materialName}
        placeholder="e.g. Centring Plates"
      />
      <FormField
        label="Total quantity"
        id="totalQuantity"
        name="totalQuantity"
        type="number"
        min="0"
        step="1"
        value={form.totalQuantity}
        onChange={handleChange}
        error={fieldErrors.totalQuantity}
      />
      {isEdit && (
        <p className="muted">
          Currently rented out: {material.rentedQuantity}. Total cannot go below this.
        </p>
      )}
      <FormField
        label="Daily rate (₹ per plate per day)"
        id="dailyRate"
        name="dailyRate"
        type="number"
        min="0"
        step="0.01"
        value={form.dailyRate}
        onChange={handleChange}
        error={fieldErrors.dailyRate}
      />

      <div className="form-actions">
        <button type="button" className="ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save changes" : "Add material"}
        </button>
      </div>
    </form>
  );
}