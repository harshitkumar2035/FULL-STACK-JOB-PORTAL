import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button/Button";
import Input from "../common/Input/Input";
import "../LoginForm.css";

function LoginForm() {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [FormData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors]= useSate({});
    const [loading, setLoading]= useState(false);

    const handleChange = (e) => {
        const {name, value} = e.traget;

        setFormData({
            ...FormData,
            [name]: value,
        });
    };

    const validate = () => {
        const newError = {};
     if (!FormData.email) {
        newError.email = "Email is required";
     }

       if (!FormData.password) {
        newError.password = "Password is required";
     }
    
     return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const useData = {
                name: "Harshit",
                email: FormData.email,
            };

            login(userData);
            navigate("/dashboard");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

     return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p>Login to continue</p>
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
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