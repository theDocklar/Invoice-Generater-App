import { useState, useMemo } from "react";
import Button from "../components/Button.jsx";
import InvoicePreview from "../components/invoice/InvoicePreview.jsx";

function CreateInvoice() {
  // Generate invoice number
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9999) + 1;
    return `BOAT-INV-${year}-${String(random).padStart(4, "0")}`;
  };

  // Invoice Meta Data
  const [invoiceData, setInvoiceData] = useState({
    // eslint-disable-next-line react-hooks/purity
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    currency: "LKR",
    status: "Draft",
    reference: "",
    projectName: "",
    notes: "",
    terms: "",
    signatureName: "",
    signatureTitle: "",
  });

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

  // Client Data
  const [clientData, setClientData] = useState({
    clientName: "",
    clientCompany: "",
    clientAddress: "",
    clientEmail: "",
    clientPhone: "",
  });

  // Line Items with discount and tax
  const [items, setItems] = useState([
    {
      id: 1,
      description: "",
      quantity: 1,
      rate: 0,
      discount: 0,
      discountType: "percentage", // or "amount"
      tax: 0,
      taxType: "percentage", // or "amount"
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
    let amount = item.quantity * item.rate;

    // Apply discount
    if (item.discount > 0) {
      if (item.discountType === "percentage") {
        amount = amount - (amount * item.discount) / 100;
      } else {
        amount = amount - item.discount;
      }
    }

    // Apply tax
    if (item.tax > 0) {
      if (item.taxType === "percentage") {
        amount = amount + (amount * item.tax) / 100;
      } else {
        amount = amount + item.tax;
      }
    }

    return Math.max(0, amount);
  };

  // Handle item change
  const handleItemChange = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate amount
          updatedItem.amount = calculateItemAmount(updatedItem);
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Add new item
  const addItem = () => {
    const newItem = {
      id: items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1,
      description: "",
      quantity: 1,
      rate: 0,
      discount: 0,
      discountType: "percentage",
      tax: 0,
      taxType: "percentage",
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
      return sum + item.quantity * item.rate;
    }, 0);

    const discountTotal = items.reduce((sum, item) => {
      const lineTotal = item.quantity * item.rate;
      if (item.discountType === "percentage") {
        return sum + (lineTotal * item.discount) / 100;
      } else {
        return sum + item.discount;
      }
    }, 0);

    const taxTotal = items.reduce((sum, item) => {
      const lineTotal = item.quantity * item.rate;
      const afterDiscount =
        item.discountType === "percentage"
          ? lineTotal - (lineTotal * item.discount) / 100
          : lineTotal - item.discount;

      if (item.taxType === "percentage") {
        return sum + (afterDiscount * item.tax) / 100;
      } else {
        return sum + item.tax;
      }
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
    if (!clientData.clientName)
      newErrors.clientName = "Client name is required";
    if (!clientData.clientEmail)
      newErrors.clientEmail = "Client email is required";

    // Validate items
    items.forEach((item, index) => {
      if (item.quantity < 0)
        newErrors[`item${index}Qty`] = "Quantity cannot be negative";
      if (item.rate < 0)
        newErrors[`item${index}Rate`] = "Unit price cannot be negative";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Invoice Data:", {
        invoiceData,
        senderData,
        clientData,
        items,
        totals,
      });
      // Generate PDF or save invoice
    }
  };

  // Handle save draft
  const handleSaveDraft = () => {
    setInvoiceData((prev) => ({ ...prev, status: "Draft" }));
    console.log("Saving draft...", {
      invoiceData,
      senderData,
      clientData,
      items,
      totals,
    });
    // Save to local storage or database
  };

  // Generate PDF
  const handleGeneratePDF = () => {
    if (validateForm()) {
      console.log("Generating PDF...");
      // PDF generation logic would go here
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Create Invoice
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details to generate your invoice
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
            <Button type="button" variant="secondary" onClick={handleSaveDraft}>
              Save as Draft
            </Button>
            <Button type="button" variant="black" onClick={handleGeneratePDF}>
              Export PDF
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
                      name="reference"
                      value={invoiceData.reference}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      value={clientData.clientName}
                      onChange={handleClientChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.clientName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter client name"
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
                      name="clientCompany"
                      value={clientData.clientCompany}
                      onChange={handleClientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Address
                    </label>
                    <textarea
                      name="clientAddress"
                      value={clientData.clientAddress}
                      onChange={handleClientChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Enter client address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="clientEmail"
                      value={clientData.clientEmail}
                      onChange={handleClientChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.clientEmail
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="client@example.com"
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
                      name="clientPhone"
                      value={clientData.clientPhone}
                      onChange={handleClientChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
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
                  {items.map((item, index) => (
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
                                e.target.value
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
                                parseFloat(e.target.value) || 0
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
                            value={item.rate}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "rate",
                                parseFloat(e.target.value) || 0
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
                            value={item.discount}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "discount",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="0"
                          />
                        </div>

                        <div className="col-span-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={item.discountType}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "discountType",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            <option value="percentage">%</option>
                            <option value="amount">Amt</option>
                          </select>
                        </div>

                        {/* Tax */}
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Tax
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.tax}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "tax",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="0"
                          />
                        </div>

                        <div className="col-span-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={item.taxType}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "taxType",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            <option value="percentage">%</option>
                            <option value="amount">Amt</option>
                          </select>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Terms & Conditions
                    </label>
                    <textarea
                      name="terms"
                      value={invoiceData.terms}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Optional terms and conditions..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Signature Name
                      </label>
                      <input
                        type="text"
                        name="signatureName"
                        value={invoiceData.signatureName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Authorized signatory name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Signature Title
                      </label>
                      <input
                        type="text"
                        name="signatureTitle"
                        value={invoiceData.signatureTitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Managing Director"
                      />
                    </div>
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
