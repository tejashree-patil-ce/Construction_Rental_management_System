import { useState } from "react";
import api, { getErrorMessage, getFieldErrors } from "../api/axios";
import FormField from "./FormField";

export default function CustomerForm({ customer, onSaved, onCancel }) {
  const isEdit = Boolean(customer);

  const [form, setForm] = useState({
    name: customer?.name ?? "",
    phone: customer?.phone ?? "",
    address: customer?.address ?? "",
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

    try {
      if (isEdit) {
        await api.put(`/customers/${customer._id}`, form);
      } else {
        await api.post("/customers", form);
      }
      onSaved();
    } catch (err) {
      const fields = getFieldErrors(err);
      setFieldErrors(fields);

      // No per-field messages? (e.g. duplicate phone) show a general one
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
        label="Name"
        id="name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={fieldErrors.name}
      />
      <FormField
        label="Phone"
        id="phone"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        error={fieldErrors.phone}
        inputMode="numeric"
        maxLength={10}
        placeholder="10-digit mobile number"
      />
      <FormField
        label="Address"
        id="address"
        name="address"
        value={form.address}
        onChange={handleChange}
        error={fieldErrors.address}
      />

      <div className="form-actions">
        <button type="button" className="ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save changes" : "Add customer"}
        </button>
      </div>
    </form>
  );
}