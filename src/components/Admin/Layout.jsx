// src/components/Layout/AdminLayout.jsx
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  CheckCircle,
  DollarSign,
  RefreshCw,
  Clock,
  CalendarX,
  LogOut,
  DatabaseIcon,
  Loader,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/all", label: "all", icon: DatabaseIcon },
    { path: "/admin/purchased", label: "Purchased", icon: ShoppingCart },
    {
      path: "/admin/load_requested",
      label: "Load Requests",
      icon: Loader,
    },

    { path: "/admin/loaded", label: "Loaded", icon: Package },
    { path: "/admin/available", label: "Available", icon: CheckCircle },
    { path: "/admin/sold", label: "Sold", icon: DollarSign },
    { path: "/admin/released", label: "Released", icon: RefreshCw },
    { path: "/admin/expiring-soon", label: "Expiring Soon", icon: Clock },
    { path: "/admin/expired", label: "Expired", icon: CalendarX },
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Welcome message */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome, Admin
              </h1>
            </div>

            {/* Right side - Logout button */}
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs - All options visible */}
          <div className="border-t border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`
                      flex items-center space-x-2 py-2 px-1 border-b-2 whitespace-nowrap transition-colors
                      ${
                        isActive(item.path)
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
