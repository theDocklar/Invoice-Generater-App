import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi";
import { useToast } from "../components/Toast";

function Login() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser({ email, password });

      if (response.success) {
        showSuccess("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      showError(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Top: Company Name */}
          <div className="px-10 py-8 bg-black border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-white text-center tracking-tight">
              theBoat
            </h1>
          </div>

          {/* Login Form */}
          <div className="px-10 py-12">
            <div className="mb-8">
              <h2 className="text-2xl font-medium text-black mb-2 text-center">
                Welcome back
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-700 uppercase tracking-wide"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 uppercase tracking-wide"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* Forgot Password */}

              <div className="flex justify-between items-center">
                <Link
                  to="/register"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Register
                </Link>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3.5 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 shadow-sm hover:shadow-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* Bottom: All Rights Reserved */}
          <div className="px-10 py-5 border-t border-gray-100 bg-black">
            <p className="text-xs text-gray-400 text-center">
              © {new Date().getFullYear()} theBoat. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
