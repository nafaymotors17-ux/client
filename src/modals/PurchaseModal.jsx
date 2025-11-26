// src/pages/admin/components/PurchaseModal.jsx
import React, { useState, useEffect } from "react";

const PurchaseModal = ({
  isOpen,
  onClose,
  onSubmit,
  purchase,
  loading,
  currentUser,
}) => {
  const [formData, setFormData] = useState({
    purchaseDate: "",
    auctionNumber: "",
    maker: "",
    chassisNumber: "",
    push: "",
    tax: "",
    auctionFee: "",
    recycle: "",
    risko: "",
    auction: "",
    yard: "",
    loadDate: "",
    ETA: "",
    modelYear: "",
    status: "purchased",
  });

  const [originalData, setOriginalData] = useState({}); // Track original values
  const [errors, setErrors] = useState({});
  const [expiryDate, setExpiryDate] = useState("");
  const [suggestedETA, setSuggestedETA] = useState("");
  useEffect(() => {
    if (purchase) {
      const initialData = {
        purchaseDate: purchase.purchaseDate
          ? new Date(purchase.purchaseDate).toISOString().split("T")[0]
          : "",
        auctionNumber: purchase.auctionNumber || "",
        maker: purchase.maker || "",
        chassisNumber: purchase.chassisNumber || "",
        push: purchase.push || "",
        tax: purchase.tax || "",
        auctionFee: purchase.auctionFee || "",
        recycle: purchase.recycle || "",
        risko: purchase.risko || "",
        auction: purchase.auction || "",
        yard: purchase.yard || "",
        loadDate: purchase.loadDate
          ? new Date(purchase.loadDate).toISOString().split("T")[0]
          : "",
        ETA: purchase.ETA
          ? new Date(purchase.ETA).toISOString().split("T")[0]
          : "",
        modelYear: purchase.modelYear || "",
        status: purchase.status || "purchased",
      };

      setFormData(initialData);
      setOriginalData(initialData); // Store original data for comparison

      if (purchase.modelYear) {
        calculateExpiryDate(purchase.modelYear);
      }
    } else {
      const newData = {
        purchaseDate: new Date().toISOString().split("T")[0],
        auctionNumber: "",
        maker: "",
        chassisNumber: "",
        push: "",
        tax: "",
        auctionFee: "",
        recycle: "",
        risko: "",
        auction: "",
        yard: "",
        loadDate: "",
        ETA: "",
        modelYear: "",
        status: "purchased",
      };
      setFormData(newData);
      setOriginalData(newData);
      setExpiryDate("");
    }
    setSuggestedETA("");
    setErrors({});
  }, [purchase, isOpen]);
  const calculateExpiryDate = (modelYear) => {
    if (!modelYear) {
      setExpiryDate("");
      return;
    }

    try {
      const [year, month] = modelYear.split("-");
      const modelYearInt = parseInt(year);
      const monthInt = parseInt(month);

      // Calculate expiry year (10 years from model year)
      let expiryYear = modelYearInt + 10;
      let expiryMonth = monthInt - 1; // One month less

      // Handle month underflow (if month becomes 0 or negative)
      if (expiryMonth < 1) {
        expiryMonth = 12;
        expiryYear = expiryYear - 1;
      }

      // Format month to always be 2 digits
      const formattedMonth = expiryMonth.toString().padStart(2, "0");

      setExpiryDate(`${expiryYear}-${formattedMonth}`);
    } catch (error) {
      console.error("Error calculating expiry date:", error);
      setExpiryDate("");
    }
  };

  // ✅ NEW: Suggest ETA as 2 months after load date (optional suggestion)
  const suggestETA = (loadDate) => {
    if (!loadDate) {
      setSuggestedETA("");
      return;
    }

    try {
      const loadDateObj = new Date(loadDate);
      const suggestedDate = new Date(loadDateObj);
      suggestedDate.setMonth(suggestedDate.getMonth() + 2); // Add 2 months

      // Format as YYYY-MM-DD
      const suggestedFormatted = suggestedDate.toISOString().split("T")[0];
      setSuggestedETA(suggestedFormatted);
    } catch (error) {
      console.error("Error suggesting ETA:", error);
      setSuggestedETA("");
    }
  };

  // ✅ NEW: Apply suggested ETA
  const applySuggestedETA = () => {
    if (suggestedETA) {
      setFormData((prev) => ({ ...prev, ETA: suggestedETA }));
      setSuggestedETA("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Calculate expiry date when model year changes
    if (name === "modelYear") {
      calculateExpiryDate(value);
    }

    // ✅ NEW: Suggest ETA when load date changes (but don't auto-set)
    if (name === "loadDate") {
      suggestETA(value);
    }

    // Clear suggested ETA when user manually changes ETA
    if (name === "ETA" && suggestedETA) {
      setSuggestedETA("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.purchaseDate)
      newErrors.purchaseDate = "Purchase date is required";
    if (!formData.auctionNumber)
      newErrors.auctionNumber = "Auction number is required";
    if (!formData.maker) newErrors.maker = "Maker is required";
    if (!formData.chassisNumber)
      newErrors.chassisNumber = "Chassis number is required";
    if (!formData.push) newErrors.push = "Push cost is required";
    if (!formData.tax) newErrors.tax = "Tax is required";
    if (!formData.auctionFee) newErrors.auctionFee = "Auction fee is required";
    if (!formData.auction) newErrors.auction = "Auction is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const getChangedFields = (currentData, originalData) => {
    const changedFields = {};

    Object.keys(currentData).forEach((key) => {
      const currentValue = currentData[key];
      const originalValue = originalData[key];

      // Check if value actually changed (handle null/undefined cases)
      if (currentValue !== originalValue) {
        // For numeric fields, compare numbers
        if (
          [
            "auctionNumber",
            "push",
            "tax",
            "auctionFee",
            "recycle",
            "risko",
          ].includes(key)
        ) {
          const currentNum = parseFloat(currentValue) || 0;
          const originalNum = parseFloat(originalValue) || 0;
          if (currentNum !== originalNum) {
            changedFields[key] = currentValue;
          }
        } else {
          changedFields[key] = currentValue;
        }
      }
    });

    return changedFields;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Remove empty strings + trim all values
    const cleanedData = {};
    Object.entries(formData).forEach(([key, val]) => {
      if (typeof val === "string") {
        const trimmed = val.trim();
        cleanedData[key] = trimmed === "" ? null : trimmed;
      } else {
        cleanedData[key] = val;
      }
    });
    const baseData = {
      ...cleanedData,
      auctionNumber: parseInt(cleanedData.auctionNumber),
      push: parseFloat(cleanedData.push),
      tax: parseFloat(cleanedData.tax),
      auctionFee: parseFloat(cleanedData.auctionFee),
      recycle: parseFloat(cleanedData.recycle) || 0,
      risko: parseFloat(cleanedData.risko) || 0,
      updatedBy: currentUser?.id || currentUser?._id,
      updatedByName: currentUser?.name || currentUser?.username,
    };
    let submitData;
    if (purchase) {
      const changedFields = getChangedFields(baseData, originalData);
      submitData = {
        ...changedFields,
        updatedBy: currentUser?.id || currentUser?._id,
        updatedByName: currentUser?.name || currentUser?.username,
      };
      console.log("🔄 Sending only changed fields:", submitData);
    } else {
      // For creates: send all data
      submitData = {
        ...baseData,
        createdBy: currentUser?.id || currentUser?._id,
        createdByName: currentUser?.name || currentUser?.username,
      };
    }

    onSubmit(submitData);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusOptions = () => {
    const options = [
      { value: "purchased", label: "Purchased" },
      { value: "load_requested", label: "Load Requested" },
      { value: "loaded", label: "Loaded" },
      { value: "available", label: "Available" },
      { value: "sold", label: "Sold" },
      { value: "released", label: "Released" },
      { value: "expired", label: "Expired" },
    ];
    return options;
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

  if (!isOpen) return null;

  const formatYen = (amount) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount || 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            {purchase ? "Edit Purchase" : "Add New Purchase"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {getStatusOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="mt-1">
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      formData.status
                    )}`}
                  >
                    {
                      getStatusOptions().find(
                        (opt) => opt.value === formData.status
                      )?.label
                    }
                  </span>
                </div>
              </div>

              {/* Required Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.purchaseDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.purchaseDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.purchaseDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auction Number *
                </label>
                <input
                  type="number"
                  name="auctionNumber"
                  value={formData.auctionNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.auctionNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.auctionNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.auctionNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maker *
                </label>
                <input
                  type="text"
                  name="maker"
                  value={formData.maker}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.maker ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.maker && (
                  <p className="mt-1 text-sm text-red-600">{errors.maker}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chassis Number *
                </label>
                <input
                  type="text"
                  name="chassisNumber"
                  value={formData.chassisNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.chassisNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.chassisNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.chassisNumber}
                  </p>
                )}
              </div>

              {/* Cost Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Push Cost *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="push"
                  value={formData.push}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.push ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.push && (
                  <p className="mt-1 text-sm text-red-600">{errors.push}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="tax"
                  value={formData.tax}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.tax ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.tax && (
                  <p className="mt-1 text-sm text-red-600">{errors.tax}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auction Fee *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="auctionFee"
                  value={formData.auctionFee}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.auctionFee ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.auctionFee && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.auctionFee}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recycle Cost
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="recycle"
                  value={formData.recycle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Cost
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="risko"
                  value={formData.risko}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auction *
                </label>
                <input
                  type="text"
                  name="auction"
                  value={formData.auction}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.auction ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.auction && (
                  <p className="mt-1 text-sm text-red-600">{errors.auction}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yard
                </label>
                <input
                  type="text"
                  name="yard"
                  value={formData.yard}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Load Date Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Load Date
                </label>
                <input
                  type="date"
                  name="loadDate"
                  value={formData.loadDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.loadDate && (
                  <p className="mt-1 text-xs text-blue-600">
                    Load date: {formatDate(formData.loadDate)}
                  </p>
                )}
              </div>

              {/* ETA Field - Now fully editable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ETA (Estimated Time of Arrival)
                </label>
                <input
                  type="date"
                  name="ETA"
                  value={formData.ETA}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.ETA && (
                  <p className="mt-1 text-xs text-green-600">
                    Estimated arrival: {formatDate(formData.ETA)}
                  </p>
                )}

                {/* ✅ ETA Suggestion */}
                {suggestedETA && !formData.ETA && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    <p className="text-yellow-700 mb-1">
                      💡 Suggested ETA: {formatDate(suggestedETA)} (2 months
                      after load)
                    </p>
                    <button
                      type="button"
                      onClick={applySuggestedETA}
                      className="text-yellow-800 hover:text-yellow-900 underline text-xs"
                    >
                      Apply this date
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model Year
                </label>
                <input
                  type="month"
                  name="modelYear"
                  value={formData.modelYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Total Calculation Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Total Cost Preview
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                <div>
                  Push:{" "}
                  <span className="font-medium">
                    {formatYen(formData.push)}
                  </span>
                </div>
                <div>
                  Tax:{" "}
                  <span className="font-medium">{formatYen(formData.tax)}</span>
                </div>
                <div>
                  Auction Fee:{" "}
                  <span className="font-medium">
                    {formatYen(formData.auctionFee)}
                  </span>
                </div>
                <div>
                  Recycle:{" "}
                  <span className="font-medium">
                    {formatYen(formData.recycle)}
                  </span>
                </div>
                <div>
                  Risk:{" "}
                  <span className="font-medium">
                    {formatYen(formData.risko)}
                  </span>
                </div>
                <div className="font-semibold text-blue-600">
                  Total:{" "}
                  {formatYen(
                    parseFloat(formData.push || 0) +
                      parseFloat(formData.tax || 0) +
                      parseFloat(formData.auctionFee || 0) +
                      parseFloat(formData.recycle || 0) +
                      parseFloat(formData.risko || 0)
                  )}
                </div>
              </div>
            </div>

            {/* Expiry Date Preview */}
            {expiryDate && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-700 mb-2">
                  Expiry Date Calculation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">
                      Model Year:
                    </span>{" "}
                    <span className="text-blue-600">
                      {formatDisplayDate(formData.modelYear)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Expiry Date:
                    </span>{" "}
                    <span
                      className={`font-semibold ${
                        new Date(expiryDate + "-01") < new Date()
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {formatDisplayDate(expiryDate)}
                      {new Date(expiryDate + "-01") < new Date() && (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          EXPIRED
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="md:col-span-2 text-xs text-blue-600">
                    * Expiry date is calculated as 10 years from model year
                    minus 1 month
                  </div>
                </div>
              </div>
            )}

            {/* Shipment Timeline Preview */}
            {(formData.loadDate || formData.ETA) && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="text-sm font-medium text-green-700 mb-2">
                  Shipment Timeline
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {formData.loadDate && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Load Date:
                      </span>{" "}
                      <span className="text-green-600">
                        {formatDate(formData.loadDate)}
                      </span>
                    </div>
                  )}
                  {formData.ETA && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Estimated Arrival:
                      </span>{" "}
                      <span className="font-semibold text-green-600">
                        {formatDate(formData.ETA)}
                      </span>
                    </div>
                  )}
                  <div className="md:col-span-2 text-xs text-green-600">
                    * Load date and ETA are independent fields. ETA is just an
                    estimate.
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : purchase ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
