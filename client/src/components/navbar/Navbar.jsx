import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { logoutUser } from "../../api/auth.api";
import logo from "../../assets/logo.png";

export default function Navbar({ onMenuClick }) {
  const { user, setUser, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get("q") || "");
      return;
    }
    setSearchQuery("");
  }, [location.pathname, location.search]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      console.error("Logout failed");
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-40 navbar">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
          >
            <HiMenu className="text-xl" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="StreamNest" className="h-7 w-auto" />
            <span className="text-sm font-semibold hidden sm:block">
              StreamNest
            </span>
          </Link>
        </div>

        {/* Center */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-xl mx-6"
        >
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`
              w-full px-4 py-2 rounded-full text-sm
              border transition backdrop-blur-md
              ${
                theme === "dark"
                  ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-400"
                  : "bg-white border-gray-300 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400"
              }
            `}
          />
        </form>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Toggle */}
          <button
            onClick={toggleTheme}
            className={`
              px-3 py-1.5 rounded-lg text-sm transition
              ${
                theme === "dark"
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }
            `}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {!loading && !user && (
            <>
              {/* Login */}
              <Link
                to="/login"
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition
                  ${
                    theme === "dark"
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }
                `}
              >
                Login
              </Link>

              {/* Signup */}
              <Link
                to="/signup"
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition
                  ${
                    theme === "dark"
                      ? "btn-primary"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }
                `}
              >
                Sign up
              </Link>
            </>
          )}

          {!loading && user && (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2"
              >
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm">
                  {user.username}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition
                  ${
                    theme === "dark"
                      ? "bg-white/10 hover:bg-red-500 text-white"
                      : "bg-gray-200 hover:bg-red-500 text-gray-800 hover:text-white"
                  }
                `}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}