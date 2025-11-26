// src/pages/admin/Dashboard.jsx
import React from "react";
import {
  ShoppingCart,
  Package,
  CheckCircle,
  DollarSign,
  RefreshCw,
  Clock,
  CalendarX,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      label: "Purchased",
      value: "1,234",
      change: "+12%",
      icon: ShoppingCart,
      color: "blue",
    },
    {
      label: "Loaded",
      value: "567",
      change: "+8%",
      icon: Package,
      color: "green",
    },
    {
      label: "Available",
      value: "890",
      change: "+5%",
      icon: CheckCircle,
      color: "emerald",
    },
    {
      label: "Sold",
      value: "345",
      change: "+15%",
      icon: DollarSign,
      color: "yellow",
    },
    {
      label: "Released",
      value: "678",
      change: "+3%",
      icon: RefreshCw,
      color: "purple",
    },
    {
      label: "Expiring Soon",
      value: "23",
      change: "-2%",
      icon: Clock,
      color: "orange",
    },
    {
      label: "Expired",
      value: "12",
      change: "+1%",
      icon: CalendarX,
      color: "red",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New purchase order #00123",
      time: "2 hours ago",
      type: "purchase",
    },
    {
      id: 2,
      action: "Item #456 marked as sold",
      time: "4 hours ago",
      type: "sold",
    },
    {
      id: 3,
      action: "New items loaded to inventory",
      time: "6 hours ago",
      type: "loaded",
    },
    {
      id: 4,
      action: "Items released from hold",
      time: "1 day ago",
      type: "released",
    },
    {
      id: 5,
      action: "5 items expiring in 3 days",
      time: "1 day ago",
      type: "expiring",
    },
  ];

  const getColorClasses = (color, isText = false) => {
    const colors = {
      blue: isText ? "text-blue-600" : "bg-blue-100 text-blue-600",
      green: isText ? "text-green-600" : "bg-green-100 text-green-600",
      emerald: isText ? "text-emerald-600" : "bg-emerald-100 text-emerald-600",
      yellow: isText ? "text-yellow-600" : "bg-yellow-100 text-yellow-600",
      purple: isText ? "text-purple-600" : "bg-purple-100 text-purple-600",
      orange: isText ? "text-orange-600" : "bg-orange-100 text-orange-600",
      red: isText ? "text-red-600" : "bg-red-100 text-red-600",
    };
    return colors[color] || "bg-gray-100 text-gray-600";
  };

  const getActivityIcon = (type) => {
    const icons = {
      purchase: ShoppingCart,
      sold: DollarSign,
      loaded: Package,
      released: RefreshCw,
      expiring: Clock,
    };
    return icons[type] || CheckCircle;
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = !stat.change.startsWith("-");

          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <div
                    className={`flex items-center mt-1 text-sm ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendingUp
                      className={`w-4 h-4 mr-1 ${!isPositive && "rotate-180"}`}
                    />
                    {stat.change}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-full ${getColorClasses(stat.color)}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${getColorClasses("blue")}`}
                    >
                      <ActivityIcon className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 text-sm">
                      {activity.action}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
              <ShoppingCart className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Add Purchase
              </span>
            </button>
            <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
              <Package className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Load Items
              </span>
            </button>
            <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
              <DollarSign className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Mark Sold
              </span>
            </button>
            <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Release Items
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
