import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import themes from "../../utils/Themes";

const Navbar = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Track user login
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [theme]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-6">

      {/* Left - Logo */}
      <div className="navbar-start">
        <Link to="/" className="text-2xl font-bold">
          Productify
        </Link>
      </div>

      {/* Center - Menu */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal gap-2">

          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>

          <li>
            <Link to="/cart">Cart</Link>
          </li>

         <li>
  <button
    onClick={() => {
      const user = localStorage.getItem("user");
      if (!user) {
        // User not logged in
        toast.error("You must be logged in to add a product!");
        return;
      }
      navigate("/add-products");
    }}
    className="btn btn-sm btn-primary"
  >
    Add Product
  </button>
</li>

        </ul>
      </div>

      {/* Right - Theme + Auth */}
      <div className="navbar-end gap-3">

        {/* Theme Dropdown */}
        <select
          className="select select-bordered select-sm"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          {themes.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>

        {/* Auth Buttons */}
        {user ? (
          <>
            <span className="font-semibold">{user.name}</span>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm btn-outline">
              Login
            </Link>

            <Link to="/signup" className="btn btn-sm btn-primary">
              Sign Up
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default Navbar;