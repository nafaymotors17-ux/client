// src/pages/admin/LoadRequestTab.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPurchases,
  updatePurchase,
  deletePurchase,
  markAsLoaded, // ✅ Mark as loaded
  rejectLoadRequest, // ✅ NEW: Reject load request
  updateFilters,
  updateSortConfig,
  clearFilters,
} from "../../../redux/features/purchaseSlice";
import PurchaseModal from "../../../modals/PurchaseModal";
import PurchaseTable from "../../../Tables/PurchaseTable";
import PurchaseFilters from "../../../components/Filters/PurchaseFilters";
import EnhancedPagination from "../../../components/Pagination/Pagination";

const LoadRequestTab = () => {
  const dispatch = useDispatch();
  const { items, loading, pagination, filters } = useSelector(
    (state) => state.purchases
  );
  const currentUser = useSelector((state) => state.auth.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);

  // Get filters for load request tab
  const loadRequestFilters = filters.load_request || {
    search: "",
    chassisNumber: "",
    modelYear: "",
    maker: "",
    auctionNumber: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  useEffect(() => {
    loadPurchases(1);
  }, []);

  const loadPurchases = (page = 1) => {
    dispatch(
      fetchPurchases({
        page,
        limit: 10,
        status: "load_requested", // ✅ Correct status name
        ...loadRequestFilters,
      })
    );
  };

  const handleEdit = (purchase) => {
    setEditingPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      dispatch(deletePurchase(id)).then(() => {
        loadPurchases(pagination.currentPage);
      });
    }
  };

  // ✅ Approve load request (mark as loaded)
  const handleApproveLoad = (id) => {
    if (window.confirm("Approve this load request and mark as loaded?")) {
      dispatch(markAsLoaded(id)).then((result) => {
        if (result.type.endsWith("/fulfilled")) {
          loadPurchases(pagination.currentPage);
        }
      });
    }
  };

  // ✅ NEW: Reject load request (back to purchased)
  const handleRejectLoad = (id) => {
    if (
      window.confirm("Reject this load request and return to purchased status?")
    ) {
      dispatch(rejectLoadRequest(id)).then((result) => {
        if (result.type.endsWith("/fulfilled")) {
          loadPurchases(pagination.currentPage);
        }
      });
    }
  };

  const handleSubmit = (purchaseData) => {
    dispatch(updatePurchase({ id: editingPurchase._id, purchaseData }))
      .then((result) => {
        if (result.type.endsWith("/fulfilled")) {
          setIsModalOpen(false);
          setEditingPurchase(null);
          loadPurchases(pagination.currentPage);
        }
      })
      .catch((error) => {
        console.error("Failed to save purchase:", error);
      });
  };

  const handleFiltersChange = (newFilters) => {
    dispatch(
      updateFilters({
        tab: "load_request",
        filters: newFilters,
      })
    );
  };

  const handleApplyFilters = (newFilters) => {
    dispatch(
      updateFilters({
        tab: "load_request",
        filters: newFilters,
      })
    );
    dispatch(
      fetchPurchases({
        page: 1,
        limit: 10,
        status: "load_requested",
        ...newFilters,
      })
    );
  };

  const handleSortChange = (sortBy, sortOrder) => {
    dispatch(
      updateSortConfig({
        tab: "load_request",
        sortBy,
        sortOrder,
      })
    );
    dispatch(
      fetchPurchases({
        page: 1,
        limit: 10,
        status: "load_requested",
        ...loadRequestFilters,
        sortBy,
        sortOrder,
      })
    );
  };

  const handleClearFilters = () => {
    dispatch(
      clearFilters({
        tab: "load_request",
      })
    );
    dispatch(
      fetchPurchases({
        page: 1,
        limit: 10,
        status: "load_requested",
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
    loadPurchases(page);
  };

  // ✅ Load Request tab fields
  const loadRequestFields = [
    { key: "purchaseDate", label: "Purchase Date", type: "date" },
    { key: "auctionNumber", label: "Auction No.", type: "text" },
    { key: "maker", label: "Maker", type: "text" },
    { key: "chassisNumber", label: "Chassis", type: "text" },
    { key: "total", label: "Total Cost", type: "currency" },
    { key: "auction", label: "Auction", type: "text" },
    { key: "modelYear", label: "Model Year", type: "month" },
    { key: "expiryDate", label: "Expiry Date", type: "month" },
    { key: "remainingDays", label: "Remaining Days", type: "remainingDays" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Load Requests</h2>
          <p className="text-gray-600 mt-1">
            Vehicles requested for loading - Approve or reject requests
          </p>
        </div>
      </div>

      <PurchaseFilters
        filters={loadRequestFilters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
        loading={loading}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <PurchaseTable
          purchases={items}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApproveLoad={handleApproveLoad} // ✅ For approving load requests
          onRejectLoad={handleRejectLoad} // ✅ For rejecting load requests
          currentTab="load_request"
          fields={loadRequestFields}
        />

        <EnhancedPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={handlePageChange}
          itemsPerPage={10}
        />
      </div>

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

export default LoadRequestTab;
