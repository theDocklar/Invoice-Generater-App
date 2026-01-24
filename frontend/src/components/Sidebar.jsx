import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "./Toast";
import { logoutUser } from "../api/userApi";

function Sidebar() {
  const [activeItem, setActiveItem] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { confirm, showSuccess } = useToast();

  // Update active item based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/create-invoice") {
      setActiveItem("create-invoice");
    } else if (path === "/invoices") {
      setActiveItem("invoice-lists");
    } else if (path === "/clients") {
      setActiveItem("clients");
    } else if (path === "/dashboard") {
      setActiveItem("analytics");
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    const confirmed = await confirm("Are you sure you want to logout?", {
      confirmText: "Logout",
      cancelText: "Cancel",
      confirmStyle: "primary",
    });

    if (confirmed) {
      try {
        // Call backend logout API to clear cookie
        await logoutUser();

        // Clear user data from localStorage
        localStorage.removeItem("user");

        // Show success message
        showSuccess("Logged out successfully");

        // Redirect to login page
        navigate("/login");
      } catch (error) {
        console.error("Logout error:", error);
        // Still clear local data and redirect even if API call fails
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  const menuItems = [
    {
      id: "create-invoice",
      label: "Create Invoice",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      id: "invoice-lists",
      label: "Invoice Lists",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: "clients",
      label: "Clients",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-20 flex flex-col bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex items-center justify-center py-6">
        <div className="w-8 h-8 flex items-center justify-center">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>

      {/* Main Menu Items */}
      <nav className="flex-1 flex flex-col items-center pt-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveItem(item.id);
              if (item.id === "invoice-lists") {
                navigate("/invoices");
              } else if (item.id === "clients") {
                navigate("/clients");
              } else if (item.id === "create-invoice") {
                navigate("/create-invoice");
              } else if (item.id === "analytics") {
                navigate("/dashboard");
              }
            }}
            className={`w-14 h-14 flex items-center justify-center rounded-lg transition-all duration-200 ${
              activeItem === item.id
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            }`}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </nav>

      {/* Bottom Menu Items */}
      <div className="flex flex-col items-center pb-6 space-y-2">
        {/* Settings Button */}
        <button
          onClick={() => setActiveItem("settings")}
          className={`w-14 h-14 flex items-center justify-center rounded-lg transition-all duration-200 ${
            activeItem === "settings"
              ? "bg-gray-50 text-gray-900"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          }`}
          title="Settings"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-14 h-14 flex items-center justify-center rounded-lg transition-all duration-200 text-gray-400 hover:text-red-600 hover:bg-red-50"
          title="Logout"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
