// src/pages/admin/Available.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPurchases,
  markAsSold,
} from "../../../redux/features/purchaseSlice";
import PurchaseTable from "../../../Tables/PurchaseTable";
import PurchaseFilters from "../../../components/Filters/PurchaseFilters";
import EnhancedPagination from "../../../components/Pagination/Pagination";

const Available = () => {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector(
    (state) => state.purchases
  );

  const [filters, setFilters] = useState({
    search: "",
    chassisNumber: "",
    modelYear: "",
    maker: "",
  });

  useEffect(() => {
    loadAvailableVehicles(1);
  }, []);

  const loadAvailableVehicles = (page = 1) => {
    dispatch(
      fetchPurchases({
        page,
        limit: 10,
        status: "available",
        ...filters,
      })
    );
  };

  const handleMarkAsSold = (id) => {
    if (window.confirm("Confirm this vehicle has been sold?")) {
      dispatch(markAsSold(id)).then((result) => {
        if (result.type.endsWith("/fulfilled")) {
          loadAvailableVehicles(pagination.currentPage);
        }
      });
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = (newFilters) => {
    loadAvailableVehicles(1);
  };

  const handlePageChange = (page) => {
    loadAvailableVehicles(page);
  };

  const availableFields = [
    { key: "purchaseDate", label: "Purchase Date", type: "date" },
    { key: "maker", label: "Maker", type: "text" },
    { key: "chassisNumber", label: "Chassis", type: "text" },
    { key: "modelYear", label: "Model Year", type: "month" },
    { key: "expiryDate", label: "Expiry Date", type: "month" },
    { key: "remainingDays", label: "Remaining Days", type: "remainingDays" },
    { key: "status", label: "Status", type: "status" },
    { key: "total", label: "Purchase Cost", type: "currency" },
    { key: "arrivedAt", label: "Arrived At", type: "date" },
    { key: "yard", label: "Location", type: "text" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Available Vehicles
          </h2>
          <p className="text-gray-600 mt-1">
            Vehicles available in showroom - Ready for sale
          </p>
        </div>
      </div>

      {/* Filters */}
      <PurchaseFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        loading={loading}
      />

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <PurchaseTable
          purchases={items}
          loading={loading}
          onMarkAsSold={handleMarkAsSold}
          currentTab="available"
          fields={availableFields}
        />

        {/* Pagination */}
        <EnhancedPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={handlePageChange}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
};

export default Available;
