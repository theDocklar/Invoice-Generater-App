const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/invoices`;

// Get next invoice number
export const getNextInvoiceNumber = async () => {
  try {
    const response = await fetch(`${API_URL}/next-invoice-number`, {
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get invoice number");
    }

    return data;
  } catch (error) {
    console.error("Error getting invoice number:", error);
    throw error;
  }
};

// Create a new invoice
export const createInvoice = async (invoiceData) => {
  try {
    const response = await fetch(`${API_URL}/create-invoice`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Create error with detailed validation info
      const error = new Error(data.message || "Failed to create invoice");
      error.errors = data.errors; // Pass validation errors
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

// Get all invoices
export const getAllInvoices = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (filters.status) queryParams.append("status", filters.status);
    if (filters.clientEmail)
      queryParams.append("clientEmail", filters.clientEmail);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);

    const url = queryParams.toString()
      ? `${API_URL}/all-invoices?${queryParams.toString()}`
      : `${API_URL}/all-invoices`;

    const response = await fetch(url, {
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch invoices");
    }

    return data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

// Get invoice by ID
export const getInvoiceById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/view/${id}`, {
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch invoice");
    }

    return data;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
};

// Update invoice
export const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Create error with detailed validation info
      const error = new Error(data.message || "Failed to update invoice");
      error.errors = data.errors; // Pass validation errors
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

// Delete invoice
export const deleteInvoice = async (id) => {
  try {
    const response = await fetch(`${API_URL}/delete-invoice/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete invoice");
    }

    return data;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};

// Update invoice status
export const updateInvoiceStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_URL}/update-status/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update invoice status");
    }

    return data;
  } catch (error) {
    console.error("Error updating invoice status:", error);
    throw error;
  }
};

// // Get invoice statistics
// export const getInvoiceStats = async () => {
//   try {
//     const response = await fetch(`${API_URL}/stats`);
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to fetch invoice statistics");
//     }

//     return data;
//   } catch (error) {
//     console.error("Error fetching invoice stats:", error);
//     throw error;
//   }
// };
