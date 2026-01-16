import invoiceService from "../services/invoiceService.js";

// Get next invoice number
export const getNextInvoiceNumber = async (req, res) => {
  try {
    const invoiceNumber = await invoiceService.generateInvoiceNumber();
    res.status(200).json({
      success: true,
      data: { invoiceNumber },
    });
  } catch (error) {
    console.error("Error generating invoice number:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice number",
      error: error.message,
    });
  }
};

// Create a new invoice controller
export const createInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;

    // Basic validation
    if (!invoiceData.dueDate) {
      return res.status(400).json({
        success: false,
        message: "Due date is required",
      });
    }

    if (!invoiceData.client) {
      return res.status(400).json({
        success: false,
        message: "Client information is required",
      });
    }

    if (!invoiceData.lineItems || invoiceData.lineItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one line item is required",
      });
    }

    // Create invoice using the service
    const newInvoice = await invoiceService.createInvoice(invoiceData);

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: newInvoice,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Handle duplicate invoice number
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Invoice number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};
