// src/components/Layout/AdminLayout.jsx - Compact Horizontal Version
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
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/all", label: "All", icon: DatabaseIcon },
    { path: "/admin/purchased", label: "Purchased", icon: ShoppingCart },
    { path: "/admin/load_requested", label: "Load Req", icon: Loader },
    { path: "/admin/loaded", label: "Loaded", icon: Package },
    { path: "/admin/available", label: "Available", icon: CheckCircle },
    { path: "/admin/sold", label: "Sold", icon: DollarSign },
    { path: "/admin/released", label: "Released", icon: RefreshCw },
    { path: "/admin/expiring-soon", label: "Expiring", icon: Clock },
    { path: "/admin/expired", label: "Expired", icon: CalendarX },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Ultra Compact Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4">
          {/* Top Bar - Very Compact */}
          <div className="flex justify-between items-center h-12">
            {/* Left - Brand & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">
                AutoStock
              </h1>
            </div>

            {/* Center - Current Page Title */}
            <div className="flex-1 text-center">
              <h2 className="text-base font-semibold text-gray-900 capitalize">
                {menuItems.find((item) => isActive(item.path))?.label ||
                  "Dashboard"}
              </h2>
            </div>

            {/* Right - User & Logout */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Compact Navigation Tabs */}
          <div className="border-t border-gray-200">
            <nav className="flex space-x-1 py-1 overflow-x-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      flex items-center space-x-1.5 py-1.5 px-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border
                      ${
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 border-transparent"
                      }
                    `}
                  >
                    <Icon className="w-3 h-3 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <nav className="p-2 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`
                        w-full flex items-center space-x-3 py-3 px-3 rounded-lg transition-colors text-sm
                        ${
                          isActive(item.path)
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "text-gray-600 hover:bg-gray-50"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content with Maximum Space */}
      <main className="flex-1 p-3 sm:p-4">
        <div className="max-w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
