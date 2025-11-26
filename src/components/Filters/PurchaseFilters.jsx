import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaSort } from "react-icons/fa";

const PurchaseFilters = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onSortChange,
  onClearFilters,
  loading = false,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setLocalFilters({ ...localFilters, [key]: value });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApplyFilters(localFilters);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  const handleClear = () => {
    const cleared = {
      search: "",
      chassisNumber: "",
      modelYear: "",
      auctionNumber: "",
      maker: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setLocalFilters(cleared);
    onClearFilters();
  };

  // ✅ FIXED: Sort toggle now works (Newest / Oldest)
  const handleSort = () => {
    const newOrder = localFilters.sortOrder === "desc" ? "asc" : "desc";

    setLocalFilters({
      ...localFilters,
      sortOrder: newOrder,
    });

    onSortChange(localFilters.sortBy, newOrder);
  };

  const hasActiveFilters =
    localFilters.search ||
    localFilters.chassisNumber ||
    localFilters.modelYear ||
    localFilters.maker ||
    localFilters.auctionNumber ||
    localFilters.sortBy !== "createdAt" ||
    localFilters.sortOrder !== "desc";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4">
      {/* ---------- TOP ROW: SEARCH + SORT + ACTIONS ---------- */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end gap-3">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by maker, model year..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <select
            value={localFilters.sortBy}
            onChange={(e) => {
              const field = e.target.value;

              setLocalFilters({
                ...localFilters,
                sortBy: field,
              });

              onSortChange(field, localFilters.sortOrder);
            }}
            className="px-2 py-1.5 border rounded-md text-sm"
          >
            <option value="createdAt">Created</option>
            <option value="expiryDate">Expiry</option>
            <option value="purchaseDate">Purchase</option>
            <option value="modelYear">Model Year</option>
          </select>

          <button
            onClick={handleSort}
            className="px-2 py-1.5 flex items-center border rounded-md text-sm hover:bg-gray-50"
          >
            <FaSort
              className={`w-4 h-4 ${
                localFilters.sortOrder === "desc" ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-red-600 border border-red-300 rounded-md text-sm hover:bg-red-50"
            >
              <FaTimes className="inline w-3 h-3 mr-1" />
              Clear
            </button>
          )}

          <button
            onClick={handleApply}
            disabled={loading}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            <FaSearch className="inline w-3 h-3 mr-1" />
            {loading ? "..." : "Search"}
          </button>
        </div>
      </div>

      {/* ---------- MINI FILTER ROW ---------- */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <input
            type="text"
            placeholder="Chassis number"
            value={localFilters.chassisNumber}
            onChange={(e) =>
              handleFilterChange("chassisNumber", e.target.value)
            }
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-1.5 border rounded-md text-sm"
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Auction number"
            value={localFilters.auctionNumber}
            onChange={(e) =>
              handleFilterChange("auctionNumber", e.target.value)
            }
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-1.5 border rounded-md text-sm"
          />
        </div>
      </div>

      {/* ---------- BADGES ---------- */}
      {hasActiveFilters && (
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(localFilters).map(
            ([key, value]) =>
              value &&
              key !== "sortBy" &&
              key !== "sortOrder" && (
                <span
                  key={key}
                  className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full flex items-center gap-1"
                >
                  {key}: {value}
                  <button
                    onClick={() => {
                      const updated = { ...localFilters, [key]: "" };
                      setLocalFilters(updated);
                      onApplyFilters(updated);
                    }}
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default PurchaseFilters;

{
  /* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Year
            </label>
            <input
              type="month"
              value={localFilters.modelYear}
              onChange={(e) => handleFilterChange("modelYear", e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div> */
}

{
  /* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maker
            </label>
            <input
              type="text"
              placeholder="e.g., Honda"
              value={localFilters.maker}
              onChange={(e) => handleFilterChange("maker", e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div> */
}
