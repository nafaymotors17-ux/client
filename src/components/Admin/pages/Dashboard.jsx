// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Package,
  CheckCircle,
  DollarSign,
  RefreshCw,
  Clock,
  CalendarX,
  User,
  Edit,
  Trash2,
  Download,
} from "lucide-react";

const Dashboard = () => {
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([
    {
      label: "Purchased",
      value: "0",
      icon: ShoppingCart,
      color: "blue",
    },
    {
      label: "Loaded",
      value: "0",
      icon: Package,
      color: "green",
    },
    {
      label: "Available",
      value: "0",
      icon: CheckCircle,
      color: "emerald",
    },
    {
      label: "Sold",
      value: "0",
      icon: DollarSign,
      color: "yellow",
    },
    {
      label: "Released",
      value: "0",
      icon: RefreshCw,
      color: "purple",
    },
    {
      label: "Expiring Soon",
      value: "0",
      icon: Clock,
      color: "orange",
    },
    {
      label: "Expired",
      value: "0",
      icon: CalendarX,
      color: "red",
    },
  ]);

  useEffect(() => {
    loadRecentActivities();
    loadStats();
  }, []);

  // In your Dashboard component
  const loadRecentActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/activities/recent-activities`
      );
      const data = await response.json();
      if (data.success) {
        setRecentActivities(data.data);
      } else {
        console.error("Failed to load activities:", data.message);
      }
    } catch (error) {
      console.error("Error loading activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadLogs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/activities/download`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `activity-logs-${
          new Date().toISOString().split("T")[0]
        }.log`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading logs:", error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/dashboard/stats`
      );
      const data = await response.json();
      console.log(data);

      if (data.success) {
        const statsData = data.data;

        // Format numbers with commas
        const formatNumber = (num) => {
          return num?.toLocaleString() || "0";
        };

        setStats([
          {
            label: "Purchased",
            value: formatNumber(statsData.purchased),
            icon: ShoppingCart,
            color: "blue",
          },
          {
            label: "Loaded",
            value: formatNumber(statsData.loaded),
            icon: Package,
            color: "green",
          },
          {
            label: "Available",
            value: formatNumber(statsData.available),
            icon: CheckCircle,
            color: "emerald",
          },
          {
            label: "Sold",
            value: formatNumber(statsData.sold),
            icon: DollarSign,
            color: "yellow",
          },
          {
            label: "Released",
            value: formatNumber(statsData.released),
            icon: RefreshCw,
            color: "purple",
          },
          {
            label: "Expiring Soon",
            value: formatNumber(statsData.expiring_soon),
            icon: Clock,
            color: "orange",
          },
          {
            label: "Expired",
            value: formatNumber(statsData.expired),
            icon: CalendarX,
            color: "red",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  const formatActivityMessage = (activity) => {
    const user = activity.user?.name || "Unknown User";
    const chassis = activity.details?.chassisNumber || "Unknown Chassis";
    const auction = activity.details?.auctionNumber || "Unknown Auction";
    const maker = activity.details?.maker || "Unknown Maker";

    switch (activity.action) {
      case "CREATE_PURCHASE":
        return `${user} created purchase: ${maker} (Chassis: ${chassis}, Auction: ${auction})`;

      case "UPDATE_PURCHASE":
        const changedFields =
          activity.details?.changedFields?.join(", ") || "details";
        return `${user} updated ${changedFields} for ${maker} (${chassis})`;

      case "DELETE_PURCHASE":
        return `${user} deleted purchase: ${maker} (Chassis: ${chassis})`;

      case "STATUS_CHANGE":
        return `${user} changed status to ${activity.details?.newStatus} for ${maker} (${chassis})`;

      default:
        return `${user} performed ${activity.action} on ${maker} (${chassis})`;
    }
  };

  const getActivityIcon = (action) => {
    switch (action) {
      case "CREATE_PURCHASE":
        return ShoppingCart;
      case "UPDATE_PURCHASE":
        return Edit;
      case "DELETE_PURCHASE":
        return Trash2;
      case "STATUS_CHANGE":
        return RefreshCw;
      default:
        return User;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

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

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity (Last 2 Days)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={downloadLogs}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Download Logs"
              >
                <Download className="w-4 h-4" />
                Logs
              </button>
              <button
                onClick={loadRecentActivities}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No recent activity found
              </p>
            ) : (
              recentActivities.map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity.action);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg px-2"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div
                        className={`p-2 rounded-full ${getColorClasses(
                          "blue"
                        )}`}
                      >
                        <ActivityIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 font-medium">
                          {formatActivityMessage(activity)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.user?.email} •{" "}
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                (window.location.href = "/admin/purchased?action=create")
              }
              className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors hover:border-blue-300"
            >
              <ShoppingCart className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Add Purchase
              </span>
            </button>
            <button
              onClick={() => (window.location.href = "/admin/load_requested")}
              className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors hover:border-green-300"
            >
              <Package className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Load Items
              </span>
            </button>
            <button
              onClick={() => (window.location.href = "/admin/available")}
              className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors hover:border-yellow-300"
            >
              <DollarSign className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Mark Sold
              </span>
            </button>
            <button
              onClick={() => (window.location.href = "/admin/sold")}
              className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors hover:border-purple-300"
            >
              <RefreshCw className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Release Items
              </span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              Activity Tracking
            </h4>
            <p className="text-xs text-blue-600">
              • All user actions are logged automatically
              <br />
              • Logs are kept for 14 days
              <br />• Download logs for audit purposes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
