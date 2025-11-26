// src/Tables/PurchaseTable.jsx
import React from "react";
import {
  FaEdit,
  FaTrash,
  FaShippingFast,
  FaTimes,
  FaCheck,
  FaHome,
  FaDollarSign,
  FaExclamationTriangle,
  FaBox,
  FaUndo,
} from "react-icons/fa";

const PurchaseTable = ({
  purchases,
  loading,
  onEdit,
  onDelete,
  markAsLoadRequested,
  onApproveLoad,
  onRejectLoad,
  onMarkAsLoaded,
  onMarkAsAvailable,
  onRemoveFromLoaded,
  onMarkAsSold,
  onRevertToPurchased,
  onMarkAsReleased,
  currentTab = "purchased",
  fields = [
    { key: "purchaseDate", label: "Purchase Date", type: "date" },
    { key: "auctionNumber", label: "Auction No.", type: "text" },
    { key: "maker", label: "Maker", type: "text" },
    { key: "chassisNumber", label: "Chassis", type: "text" },
    { key: "total", label: "Total Cost", type: "currency" },
    { key: "status", label: "Status", type: "status" },
    { key: "auction", label: "Auction", type: "text" },
    { key: "modelYear", label: "Model Year", type: "month" },
    { key: "expiryDate", label: "Expiry Date", type: "month" },
    { key: "remainingDays", label: "Remaining Days", type: "remainingDays" },
    { key: "ETA", label: "ETA", type: "date" },
    { key: "createdAt", label: "Created At", type: "datetime" },
  ],
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatMonth = (monthString) => {
    if (!monthString) return "-";
    const [year, month] = monthString.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      purchased: "bg-blue-100 text-blue-800",
      load_requested: "bg-yellow-100 text-yellow-800",
      loaded: "bg-orange-100 text-orange-800",
      available: "bg-green-100 text-green-800",
      sold: "bg-purple-100 text-purple-800",
      released: "bg-indigo-100 text-indigo-800",
      expired: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const labels = {
      purchased: "Purchased",
      load_requested: "Load Requested",
      loaded: "Loaded",
      available: "Available",
      sold: "Sold",
      released: "Released",
      expired: "Expired",
    };
    return labels[status] || status;
  };

  const getRemainingDaysColor = (days) => {
    if (days < 0) return "text-red-600 bg-red-100";
    if (days <= 30) return "text-red-600 bg-red-100";
    if (days <= 60) return "text-orange-600 bg-orange-100";
    return "text-green-600 bg-green-100";
  };

  const getRemainingDaysText = (days) => {
    if (days < 0) return `${Math.abs(days)} days expired`;
    if (days === 0) return "Expires today";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  };

  const renderCellContent = (purchase, field) => {
    const value = purchase[field.key];

    switch (field.type) {
      case "currency":
        return formatCurrency(value);
      case "date":
        return formatDate(value);
      case "month":
        return formatMonth(value);
      case "status":
        return (
          <span
            className={`inline-flex px-1 py-1 rounded-full text-xs font-medium ${getStatusColor(
              value
            )}`}
          >
            {getStatusLabel(value)}
          </span>
        );
      case "remainingDays":
        const days = purchase.remainingDays;
        if (days === undefined || days === null) return "-";
        return (
          <div className="flex items-center gap-1">
            {(days <= 30 || days < 0) && (
              <FaExclamationTriangle className="w-3 h-3 text-red-500 flex-shrink-0" />
            )}
            <span
              className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getRemainingDaysColor(
                days
              )}`}
            >
              {getRemainingDaysText(days)}
            </span>
          </div>
        );
      case "datetime":
        if (!value) return "-";
        const d = new Date(value);
        return (
          <div className="flex flex-col leading-tight">
            <span className="text-sm">
              {d.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-xs text-gray-500">
              {d.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );

      default:
        return value || "-";
    }
  };

  // Render actions based on current tab
  const renderActions = (purchase) => {
    switch (currentTab) {
      case "all":
        return (
          <>
            <button
              onClick={() => onEdit(purchase)}
              className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
              title="Edit Purchase"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(purchase._id)}
              className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
              title="Delete Purchase"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </>
        );

      case "purchased":
        return (
          <>
            <button
              onClick={() => onEdit(purchase)}
              className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
              title="Edit Purchase"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => markAsLoadRequested(purchase._id)}
              className="text-orange-600 hover:text-orange-900 transition-colors p-1 rounded hover:bg-orange-50"
              title="Request Load"
            >
              <FaShippingFast className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(purchase._id)}
              className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
              title="Delete Purchase"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </>
        );

      case "load_request":
        return (
          <>
            <button
              onClick={() => onEdit(purchase)}
              className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
              title="Edit Details"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onApproveLoad(purchase._id)}
              className="text-green-600 hover:text-green-900 transition-colors p-1 rounded hover:bg-green-50"
              title="Approve Load"
            >
              <FaCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRejectLoad(purchase._id)}
              className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
              title="Reject Load Request"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </>
        );

      case "loaded":
        return (
          <>
            <button
              onClick={() => onEdit(purchase)}
              className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
              title="Edit Details"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onMarkAsAvailable(purchase._id)}
              className="text-green-600 hover:text-green-900 transition-colors p-1 rounded hover:bg-green-50"
              title="Mark as Available"
            >
              <FaHome className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRemoveFromLoaded(purchase._id)}
              className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
              title="Remove from Loaded"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </>
        );

      case "available":
        return (
          <>
            <button
              onClick={() => onMarkAsSold(purchase._id)}
              className="text-purple-600 hover:text-purple-900 transition-colors p-1 rounded hover:bg-purple-50"
              title="Mark as Sold"
            >
              <FaDollarSign className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRevertToPurchased(purchase._id)}
              className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
              title="Revert to Purchased"
            >
              <FaUndo className="w-4 h-4" />
            </button>
          </>
        );

      case "sold":
        return (
          <button
            onClick={() => onMarkAsReleased(purchase._id)}
            className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded hover:bg-indigo-50"
            title="Mark as Released"
          >
            <FaCheck className="w-4 h-4" />
          </button>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading purchases...</p>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No purchases found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-400">
        <thead className="bg-gray-50">
          <tr>
            {fields.map((field) => (
              <th
                key={field.key}
                className="px-2 py-1 text-left text-xs font-medium text-gray-900 uppercase"
              >
                {field.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {purchases.map((purchase) => (
            <tr key={purchase._id} className="hover:bg-gray-50">
              {fields.map((field) => (
                <td
                  key={field.key}
                  className="px-3 py-1 whitespace-nowrap text-sm text-gray-900"
                >
                  {renderCellContent(purchase, field)}
                </td>
              ))}
              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-2">
                  {renderActions(purchase)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseTable;
