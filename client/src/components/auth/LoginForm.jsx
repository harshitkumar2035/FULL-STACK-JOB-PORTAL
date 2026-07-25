import { useState } from "react";
import Input from "../common/Input/Input";
import Button from "../common/Button/Button";
import "./LoginForm.css";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // User typing -> old error remove
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  }
  function validateForm() {
    const newErrors = {};
    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email";
    }
    // Password Validati
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }
    return newErrors;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    console.log("Login Data:", formData);
    setTimeout(() => {
      setLoading(false);
      alert("Validation Passed ✅");
    }, 1500);
  }

  return (
    <div className="login-card">
      <h2>Welcome Back</h2>
      <p>Login to continue</p>
      <form onSubmit={handleSubmit}>
   <Input
     label="Email"
      name="email"
       type="email"
      placeholder="Enter your email"
        value={formData.email}
      onChange={handleChange}
        error={errors.email}
        />
    <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        />
   <Button
      type="submit"
        loading={loading}
        >
      Login
      </Button>
            </form>
   </div>
  );
}
export default LoginForm;