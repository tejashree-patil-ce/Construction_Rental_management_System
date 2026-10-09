export default function SelectField({ label, id, error, children, ...selectProps }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className={error ? "invalid" : ""} {...selectProps}>
        {children}
      </select>
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}