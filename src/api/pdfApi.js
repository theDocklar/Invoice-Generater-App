const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api`;

export const downloadInvoicePDF = async (invoiceId) => {
  try {
    const response = await fetch(`${API_URL}/invoices/download/${invoiceId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to download PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoiceId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("PDF Download Error:", error);
    return { success: false, error: error.message };
  }
};

export const previewInvoicePDF = (invoiceId) => {
  const url = `${API_URL}/invoices/preview/${invoiceId}`;
  window.open(url, "_blank");
};
