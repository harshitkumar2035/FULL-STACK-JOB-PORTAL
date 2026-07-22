import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
          <nav className="navbar">
      <div className="logo">
        JobPortal
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/jobs">
            Jobs
          </NavLink>
        </li>
        <li>
          <NavLink to="/login">
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to="/register">
            Register
          </NavLink>
        </li>
      </ul>
    </nav>
    );
}
export default Navbar;
