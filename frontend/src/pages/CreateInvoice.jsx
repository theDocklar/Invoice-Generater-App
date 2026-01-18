import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import InvoicePreview from "../components/invoice/InvoicePreview.jsx";
import { useToast } from "../components/Toast.jsx";
import {
  createInvoice,
  getNextInvoiceNumber,
  updateInvoice,
  getInvoiceById,
} from "../api/invoiceApi.js";
import { getAllClients } from "../api/clientApi.js";

function CreateInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const isEditMode = !!id;

  // Invoice Meta Data
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "Loading...",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    currency: "LKR",
    status: "Draft",
    referenceNumber: "",
    projectName: "",
    notes:
      "Payment is due within 30 days. Please make payment to the account details provided. Thank you for your business!",
  });

  // Fetch invoice number on component mount (only for create mode)
  useEffect(() => {
    if (!isEditMode) {
      const fetchInvoiceNumber = async () => {
        try {
          const response = await getNextInvoiceNumber();
          if (response.success) {
            setInvoiceData((prev) => ({
              ...prev,
              invoiceNumber: response.data.invoiceNumber,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch invoice number:", error);
          showError("Failed to load invoice number");
        }
      };
      fetchInvoiceNumber();
    }
  }, [showError, isEditMode]);

  // Sender Data (theBOAT)
  const [senderData, setSenderData] = useState({
    companyName: "theBOAT",
    address: "123 Marine Drive, Colombo 03, Sri Lanka",
    email: "hello@theboat.lk",
    phone: "+94 11 234 5678",
    website: "www.theboat.lk",
    taxId: "BR-12345678",
    accountName: "theBOAT (Pvt) Ltd",
    bankName: "Commercial Bank of Ceylon",
    accountNumber: "1234567890",
    swiftCode: "CCEYLKLX",
  });

  // Fetch existing invoice data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchInvoiceData = async () => {
        setIsLoading(true);
        try {
          const response = await getInvoiceById(id);
          if (response.success) {
            const invoice = response.data;

            // Set invoice metadata
            setInvoiceData({
              invoiceNumber: invoice.invoiceNumber,
              invoiceDate: invoice.invoiceDate.split("T")[0],
              dueDate: invoice.dueDate.split("T")[0],
              currency: invoice.currency,
              status: invoice.status,
              referenceNumber: invoice.referenceNumber || "",
              projectName: invoice.projectName || "",
              notes: invoice.notes || "",
            });

            // Set client data
            setClientData({
              name: invoice.client.name,
              company: invoice.client.company || "",
              address: invoice.client.address,
              email: invoice.client.email,
              phone: invoice.client.phone || "",
            });
            setSelectedClientId(invoice.client.clientId || "");

            // Set line items
            const mappedItems = invoice.lineItems.map((item, index) => ({
              id: index + 1,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: {
                type: item.discount?.type || "percentage",
                value: item.discount?.value || "",
              },
              tax: item.tax || "",
              amount: item.lineTotal || 0,
            }));
            setItems(mappedItems);
          }
        } catch (error) {
          console.error("Failed to load invoice:", error);
          showError("Failed to load invoice data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchInvoiceData();
    }
  }, [id, isEditMode, showError]);

  // Fetch clients details
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getAllClients();
        if (response.success) {
          setClients(response.data);
        }
      } catch (error) {
        console.error("Failed to load clients: ", error);
      }
    };
    fetchClients();
  }, []);

  // Client Data
  const [clientData, setClientData] = useState({
    name: "",
    company: "",
    address: "",
    email: "",
    phone: "",
  });

  // Line Items with discount and tax
  const [items, setItems] = useState([
    {
      id: 1,
      description: "",
      quantity: "",
      unitPrice: "",
      discount: {
        type: "percentage",
        value: "",
      },
      tax: "",
      amount: 0,
    },
  ]);

  const [showPreview, setShowPreview] = useState(true);
  const [errors, setErrors] = useState({});

  // Handle invoice data change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Validate due date
    if (
      name === "dueDate" &&
      invoiceData.invoiceDate &&
      value < invoiceData.invoiceDate
    ) {
      setErrors((prev) => ({
        ...prev,
        dueDate: "Due date must be after invoice date",
      }));
    }
  };

  // Handle sender data change
  const handleSenderChange = (e) => {
    const { name, value } = e.target;
    setSenderData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle client data change
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate line item amount
  const calculateItemAmount = (item) => {
    let amount = item.quantity * item.unitPrice;

    // Apply discount
    if (item.discount.value > 0) {
      if (item.discount.type === "percentage") {
        amount = amount - (amount * item.discount.value) / 100;
      } else {
        amount = amount - item.discount.value;
      }
    }

    // Apply tax
    if (item.tax > 0) {
      amount = amount + (amount * item.tax) / 100;
    }

    return Math.max(0, amount);
  };

  // Handle item change
  const handleItemChange = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          let updatedItem = { ...item };

          // Handle nested properties like "discount.value" or "discount.type"
          if (field.includes(".")) {
            const [parent, child] = field.split(".");
            updatedItem[parent] = { ...updatedItem[parent], [child]: value };
          } else {
            updatedItem[field] = value;
          }

          // Recalculate amount
          updatedItem.amount = calculateItemAmount(updatedItem);
          return updatedItem;
        }
        return item;
      }),
    );
  };

  // Add new item
  const addItem = () => {
    const newItem = {
      id: items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1,
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: {
        type: "percentage",
        value: "",
      },
      tax: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  // Remove item
  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    const discountTotal = items.reduce((sum, item) => {
      const lineTotal = item.quantity * item.unitPrice;
      if (item.discount.type === "percentage") {
        return sum + (lineTotal * item.discount.value) / 100;
      } else {
        return sum + item.discount.value;
      }
    }, 0);

    const taxTotal = items.reduce((sum, item) => {
      const lineTotal = item.quantity * item.unitPrice;
      const afterDiscount =
        item.discount.type === "percentage"
          ? lineTotal - (lineTotal * item.discount.value) / 100
          : lineTotal - item.discount.value;

      return sum + (afterDiscount * item.tax) / 100;
    }, 0);

    const grandTotal = subtotal - discountTotal + taxTotal;

    return { subtotal, discountTotal, taxTotal, grandTotal };
  }, [items]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!invoiceData.invoiceNumber)
      newErrors.invoiceNumber = "Invoice number is required";
    if (!invoiceData.invoiceDate)
      newErrors.invoiceDate = "Invoice date is required";
    if (!invoiceData.dueDate) newErrors.dueDate = "Due date is required";
    if (
      invoiceData.dueDate &&
      invoiceData.invoiceDate &&
      invoiceData.dueDate < invoiceData.invoiceDate
    ) {
      newErrors.dueDate = "Due date must be after invoice date";
    }
    if (!clientData.name) newErrors.clientName = "Client name is required";
    if (!clientData.email) newErrors.clientEmail = "Client email is required";
    if (!clientData.address)
      newErrors.clientAddress = "Client address is required";

    // Validate items
    items.forEach((item, index) => {
      if (!item.description)
        newErrors[`item${index}Desc`] = "Description is required";
      if (item.quantity <= 0)
        newErrors[`item${index}Qty`] = "Quantity must be greater than 0";
      if (item.unitPrice < 0)
        newErrors[`item${index}Rate`] = "Unit price cannot be negative";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle client selection from dropdown
  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);

    if (clientId) {
      const selectedClient = clients.find((c) => c._id === clientId);

      if (selectedClient) {
        setClientData({
          name: selectedClient.name,
          company: selectedClient.companyName,
          address: selectedClient.address,
          email: selectedClient.email,
          phone: selectedClient.mobile,
        });
      }
    } else {
      setClientData({
        name: "",
        company: "",
        address: "",
        email: "",
        phone: "",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform data to match backend schema
      const invoicePayload = {
        invoiceDate: invoiceData.invoiceDate,
        dueDate: invoiceData.dueDate,
        currency: invoiceData.currency,
        status: invoiceData.status,
        referenceNumber: invoiceData.referenceNumber || "",
        projectName: invoiceData.projectName || "",
        client: {
          clientId: selectedClientId || null,
          name: clientData.name,
          company: clientData.company || "",
          address: clientData.address,
          email: clientData.email,
          phone: clientData.phone,
        },
        lineItems: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: {
            type: item.discount.type,
            value: item.discount.value,
          },
          tax: item.tax,
        })),
        notes: invoiceData.notes,
      };

      let response;
      if (isEditMode) {
        response = await updateInvoice(id, invoicePayload);
        if (response.success) {
          showSuccess("Invoice updated successfully!");
          console.log("Updated Invoice:", response.data);
          // Navigate back to invoices page after a short delay
          setTimeout(() => navigate("/invoices"), 1500);
        }
      } else {
        response = await createInvoice(invoicePayload);
        if (response.success) {
          showSuccess("Invoice created successfully!");
          console.log("Created Invoice:", response.data);
          // Navigate back to invoices page after a short delay
          setTimeout(() => navigate("/invoices"), 1500);
        }
      }
    } catch (error) {
      showError(
        error.message ||
          `Failed to ${isEditMode ? "update" : "create"} invoice`,
      );
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    setInvoiceData((prev) => ({ ...prev, status: "Draft" }));

    // Call handleSubmit with Draft status
    const fakeEvent = { preventDefault: () => {} };
    await handleSubmit(fakeEvent);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {isEditMode ? "Edit Invoice" : "Create Invoice"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode
                ? "Update invoice details and preview changes"
                : "Fill in the details to generate your invoice"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
            {!isEditMode && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </Button>
            )}
            <Button
              type="submit"
              variant="black"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Invoice"
                  : "Create Invoice"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Form */}
        <div
          className={`${
            showPreview ? "w-1/2" : "w-full"
          } overflow-y-auto bg-gray-50`}
        >
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Invoice Meta Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Invoice Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={handleInputChange}
                      disabled
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.invoiceNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.invoiceNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.invoiceNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={invoiceData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="invoiceDate"
                      value={invoiceData.invoiceDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.invoiceDate
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={invoiceData.dueDate}
                      onChange={handleInputChange}
                      min={invoiceData.invoiceDate}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.dueDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.dueDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.dueDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={invoiceData.currency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="LKR">LKR - Sri Lankan Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reference / PO Number
                    </label>
                    <input
                      type="text"
                      name="referenceNumber"
                      value={invoiceData.referenceNumber}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project / Service Name
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      value={invoiceData.projectName}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sender Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Sender Information (theBOAT)
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={senderData.companyName}
                      onChange={handleSenderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={senderData.email}
                      onChange={handleSenderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={senderData.address}
                      onChange={handleSenderChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={senderData.phone}
                      onChange={handleSenderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={senderData.website}
                      onChange={handleSenderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax ID / BR Number
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={senderData.taxId}
                      onChange={handleSenderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Bank Details */}
                  <div className="col-span-2 border-t border-gray-200 pt-4 mt-2">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Bank Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Name
                        </label>
                        <input
                          type="text"
                          name="accountName"
                          value={senderData.accountName}
                          onChange={handleSenderChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={senderData.bankName}
                          onChange={handleSenderChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={senderData.accountNumber}
                          onChange={handleSenderChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SWIFT / IBAN Code
                        </label>
                        <input
                          type="text"
                          name="swiftCode"
                          value={senderData.swiftCode}
                          onChange={handleSenderChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Client Information
                </h2>
                {/* Dropdown to select existing client OR add new */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Client
                  </label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">
                      -- Select Existing Client or Enter New --
                    </option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.name}{" "}
                        {client.companyName ? `(${client.companyName})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Selection Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      {selectedClientId
                        ? "Selected Client Details"
                        : "Or Enter Client Details"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={clientData.name}
                      onChange={handleClientChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.clientName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter client name"
                      disabled={selectedClientId !== ""}
                    />
                    {errors.clientName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.clientName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={clientData.company}
                      onChange={handleClientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                      disabled={selectedClientId !== ""}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Address
                    </label>
                    <textarea
                      name="address"
                      value={clientData.address}
                      onChange={handleClientChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Enter client address"
                      disabled={selectedClientId !== ""}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={clientData.email}
                      onChange={handleClientChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.clientEmail
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="client@example.com"
                      disabled={selectedClientId !== ""}
                    />
                    {errors.clientEmail && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.clientEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={clientData.phone}
                      onChange={handleClientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                      disabled={selectedClientId !== ""}
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Line Items
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={addItem}
                  >
                    + Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="grid grid-cols-12 gap-3">
                        {/* Description */}
                        <div className="col-span-12">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "description",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Item or service description"
                          />
                        </div>

                        {/* Quantity */}
                        <div className="col-span-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "quantity",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="col-span-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Unit Price
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "unitPrice",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="0.00"
                          />
                        </div>

                        {/* Discount */}
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Discount
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.discount.value}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "discount.value",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="0"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={item.discount.type}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "discount.type",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            <option value="percentage">%</option>
                            <option value="fixed">Fixed Amount</option>
                          </select>
                        </div>

                        {/* Tax */}
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Tax (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={item.tax}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "tax",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      {/* Line Total and Delete */}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300">
                        <div className="text-sm">
                          <span className="text-gray-600">Line Total: </span>
                          <span className="font-semibold text-gray-900">
                            {invoiceData.currency} {item.amount.toFixed(2)}
                          </span>
                        </div>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Additional Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes / Payment Instructions
                    </label>
                    <textarea
                      name="notes"
                      value={invoiceData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Thank you for your business. Payment is due within 30 days."
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Live Preview */}
        {showPreview && (
          <div className="w-1/2 border-l border-gray-300 bg-gray-100">
            <InvoicePreview
              invoiceData={invoiceData}
              senderData={senderData}
              clientData={clientData}
              items={items}
              totals={totals}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateInvoice;
