export default function FormField({ label, id, error, ...inputProps }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className={error ? "invalid" : ""} {...inputProps} />
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}