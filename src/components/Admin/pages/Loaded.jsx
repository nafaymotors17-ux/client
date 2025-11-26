// src/pages/admin/Loaded.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPurchases,
  updatePurchase,
  markAsArrived,
  updateFilters,
  updateSortConfig,
  clearFilters,
} from "../../../redux/features/purchaseSlice";
import PurchaseModal from "../../../modals/PurchaseModal";
import PurchaseTable from "../../../Tables/PurchaseTable";
import PurchaseFilters from "../../../components/Filters/PurchaseFilters";
import EnhancedPagination from "../../../components/Pagination/Pagination";

const Loaded = () => {
  const dispatch = useDispatch();
  const { items, loading, pagination, filters } = useSelector(
    (state) => state.purchases
  );
  const currentUser = useSelector((state) => state.auth.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);

  // Get filters for loaded tab
  const loadedFilters = filters.loaded || {
    search: "",
    chassisNumber: "",
    modelYear: "",
    maker: "",
    auctionNumber: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  useEffect(() => {
    // Always fetch fresh data when component mounts - only loaded status
    loadLoadedVehicles(1);
  }, []);

  const loadLoadedVehicles = (page = 1) => {
    dispatch(
      fetchPurchases({
        page,
        limit: 10,
        status: "loaded", // Only fetch vehicles with loaded status
        ...loadedFilters,
      })
    );
  };

  const handleEdit = (purchase) => {
    setEditingPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleSubmit = (purchaseData) => {
    dispatch(updatePurchase({ id: editingPurchase._id, purchaseData }))
      .then((result) => {
        if (result.type.endsWith("/fulfilled")) {
          setIsModalOpen(false);
          setEditingPurchase(null);
          loadLoadedVehicles(pagination.currentPage);
        }
      })
      .catch((error) => {
        console.error("Failed to update purchase:", error);
      });
  };

  const handleMarkAsArrived = (id) => {
    if (window.confirm("Confirm this vehicle has arrived in the showroom?")) {
      dispatch(markAsArrived(id)).then((result) => {
        if (result.type.endsWith("/fulfilled")) {
          loadLoadedVehicles(pagination.currentPage);
        }
      });
    }
  };

  const handleFiltersChange = (newFilters) => {
    // Update filters in Redux store for loaded tab
    dispatch(
      updateFilters({
        tab: "loaded",
        filters: newFilters,
      })
    );
  };

  const handleApplyFilters = (newFilters) => {
    // Apply filters and reload data
    dispatch(
      updateFilters({
        tab: "loaded",
        filters: newFilters,
      })
    );
    loadLoadedVehicles(1);
  };

  const handleSortChange = (sortBy, sortOrder) => {
    // Update sort config in Redux store for loaded tab
    dispatch(
      updateSortConfig({
        tab: "loaded",
        sortBy,
        sortOrder,
      })
    );
    // Reload with new sort
    dispatch(
      fetchPurchases({
        page: 1,
        limit: 10,
        status: "loaded", // Only fetch loaded status
        ...loadedFilters,
        sortBy,
        sortOrder,
      })
    );
  };

  const handleClearFilters = () => {
    // Clear filters in Redux store for loaded tab
    dispatch(
      clearFilters({
        tab: "loaded",
      })
    );
    // Reload data without filters - only loaded status
    dispatch(
      fetchPurchases({
        page: 1,
        limit: 10,
        status: "loaded", // Only fetch loaded status
        search: "",
        chassisNumber: "",
        modelYear: "",
        maker: "",
        auctionNumber: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      })
    );
  };

  const handlePageChange = (page) => {
    loadLoadedVehicles(page);
  };

  const loadedFields = [
    { key: "purchaseDate", label: "Purchase Date", type: "date" },
    { key: "maker", label: "Maker", type: "text" },
    { key: "chassisNumber", label: "Chassis", type: "text" },
    { key: "modelYear", label: "Model Year", type: "month" },
    { key: "expiryDate", label: "Expiry Date", type: "month" },
    { key: "remainingDays", label: "Remaining Days", type: "remainingDays" },
    { key: "status", label: "Status", type: "status" },
    { key: "loadDate", label: "Loaded Date", type: "date" },

    { key: "ETA", label: "Expected Arrival", type: "date" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Loaded Vehicles</h2>
          <p className="text-gray-600 mt-1">
            Vehicles loaded onto ships - In transit to Pakistan
          </p>
        </div>
      </div>

      {/* Filters */}
      <PurchaseFilters
        filters={loadedFilters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
        loading={loading}
      />

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <PurchaseTable
          purchases={items}
          loading={loading}
          onEdit={handleEdit}
          markAsArrived={handleMarkAsArrived}
          currentTab="loaded"
          fields={loadedFields}
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

      {/* Modal */}
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPurchase(null);
        }}
        onSubmit={handleSubmit}
        purchase={editingPurchase}
        loading={loading}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Loaded;
