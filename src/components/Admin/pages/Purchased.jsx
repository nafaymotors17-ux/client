// src/pages/admin/Purchased.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPurchases,
  createPurchase,
  updatePurchase,
  deletePurchase,
  markAsLoadRequested, // ✅ NEW: Mark as load requested
  updateFilters,
  updateSortConfig,
  clearFilters,
} from "../../../redux/features/purchaseSlice";
import PurchaseModal from "../../../modals/PurchaseModal";
import PurchaseTable from "../../../Tables/PurchaseTable";
import PurchaseFilters from "../../../components/Filters/PurchaseFilters";
import EnhancedPagination from "../../../components/Pagination/Pagination";
import { FaPlus } from "react-icons/fa";

const Purchased = () => {
  const dispatch = useDispatch();
  const { items, loading, pagination, filters } = useSelector(
    (state) => state.purchases
  );
  const currentUser = useSelector((state) => state.auth.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);

  // Get filters for purchased tab
  const purchasedFilters = filters.purchased || {
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
        status: "purchased",
        ...purchasedFilters,
      })
    );
  };

  const handleCreate = () => {
    setEditingPurchase(null);
    setIsModalOpen(true);
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

  // ✅ NEW: Mark as load requested
  const handleMarkAsLoadRequested = (id) => {
    if (window.confirm("Submit load request for this vehicle?")) {
      dispatch(markAsLoadRequested(id)).then((result) => {
        if (result.type.endsWith("/fulfilled")) {
          loadPurchases(pagination.currentPage);
        }
      });
    }
  };

  const handleSubmit = (purchaseData) => {
    const action = editingPurchase
      ? updatePurchase({ id: editingPurchase._id, purchaseData })
      : createPurchase(purchaseData);

    dispatch(action)
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
        tab: "purchased",
        filters: newFilters,
      })
    );
  };

  const handleApplyFilters = (newFilters) => {
    dispatch(
      updateFilters({
        tab: "purchased",
        filters: newFilters,
      })
    );
    dispatch(
      fetchPurchases({
        page: 1,
        limit: 10,
        status: "purchased",
        ...newFilters,
      })
    );
  };

  const handleSortChange = (sortBy, sortOrder) => {
    dispatch(
      updateSortConfig({
        tab: "purchased",
        sortBy,
        sortOrder,
      })
    );
    dispatch(
      fetchPurchases({
        page: 1,
        limit: 10,
        status: "purchased",
        ...purchasedFilters,
        sortBy,
        sortOrder,
      })
    );
  };

  const handleClearFilters = () => {
    dispatch(
      clearFilters({
        tab: "purchased",
      })
    );
    dispatch(
      fetchPurchases({
        page: 1,
        limit: 10,
        status: "purchased",
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

  // ✅ Purchased tab fields
  const purchasedFields = [
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
          <h2 className="text-3xl font-bold text-gray-900">
            Purchased Vehicles
          </h2>
          <p className="text-gray-600 mt-1">Ready for load requests</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Add Purchase
        </button>
      </div>

      <PurchaseFilters
        filters={purchasedFilters}
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
          onMarkAsLoadRequested={handleMarkAsLoadRequested} // ✅ NEW action
          currentTab="purchased"
          fields={purchasedFields}
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

export default Purchased;
