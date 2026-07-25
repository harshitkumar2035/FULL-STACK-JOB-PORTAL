import LoginForm from "../components/auth/LoginForm";

function Login() {
  return (
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 180px)" }}>
      <LoginForm />
    </div>
  );
}

export default Login;