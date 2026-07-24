import "./Input.css";

function Input({
   label,
   type = "text",
   placeholder = "",
  value,
  onChange,
  name,
  required = false,
  error = "",
}) {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <input
        className={`input-field ${error ? "input-error" : ""}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
      />
      {error && (
        <p className="error-text">
          {error}
        </p>
      )}
    </div>
  );
}
export default Input;