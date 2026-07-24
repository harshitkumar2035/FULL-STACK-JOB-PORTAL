import { useState } from "react";
import Button from "../common/Button/Button";
import Input from "../common/Input/Input";
import "../LoginForm.css";

function LoginForm() {
    const [FormData, setFormData] = useState({
        email: "",
        password: "",
    });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log(formData);
  }

     return (
    <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Login to continue</p>
        <form onSubmit={handleSubmit} >
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />

        <Button type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;