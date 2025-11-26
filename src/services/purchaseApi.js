// Helper function to handle API calls
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  if (!data.success) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const purchaseService = {
  // Create new purchase
  createPurchase: async (purchaseData) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/purchases/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      }
    );
    return handleResponse(response);
  },

  // Get all purchases with pagination
  getPurchases: async ({
    page = 1,
    limit = 10,
    status = "",
    search = "",
    chassisNumber = "",
    modelYear = "",
    maker = "",
    auctionNumber = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(search && { search }),
      ...(chassisNumber && { chassisNumber }),
      ...(modelYear && { modelYear }),
      ...(maker && { maker }),
      ...(auctionNumber && { auctionNumber }),
      sortBy,
      sortOrder,
    });

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/purchases/list?${params.toString()}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    return handleResponse(response);
  },

  // Update purchase
  updatePurchase: async (id, purchaseData) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/purchases/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      }
    );
    return handleResponse(response);
  },

  // Delete purchase
  deletePurchase: async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/purchases/${id}`, // ✅ Fixed
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return handleResponse(response);
  },

  // Update purchase status
  updatePurchaseStatus: async (id, statusData) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/purchases/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusData),
      }
    );
    return handleResponse(response);
  },

  // Revert to purchased
  revertToPurchased: async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/purchases/${id}/revert-to-purchased`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return handleResponse(response);
  },
};
