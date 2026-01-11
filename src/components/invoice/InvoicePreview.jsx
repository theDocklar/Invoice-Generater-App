import { useMemo } from "react";

function InvoicePreview({
  invoiceData,
  senderData,
  clientData,
  items,
  totals,
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: invoiceData.currency || "LKR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white h-full overflow-auto">
      {/* A4 Container */}
      <div
        className="max-w-[210mm] mx-auto bg-white shadow-lg"
        style={{ minHeight: "297mm" }}
      >
        {/* Invoice Content with padding */}
        <div className="p-12">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            {/* Logo and Company Info */}
            <div>
              <div className="mb-4">
                <h1 className="text-4xl font-bold text-black">theBOAT</h1>
                <div className="h-1 w-16 bg-black mt-1"></div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{senderData.address}</p>
                <p>{senderData.email}</p>
                <p>{senderData.phone}</p>
                {senderData.website && <p>{senderData.website}</p>}
                {senderData.taxId && <p>Tax ID: {senderData.taxId}</p>}
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="text-right">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">INVOICE</h2>
              <div className="text-sm space-y-2">
                <div className="flex justify-between gap-8">
                  <span className="text-gray-600">Invoice #:</span>
                  <span className="font-semibold">
                    {invoiceData.invoiceNumber}
                  </span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-gray-600">Date:</span>
                  <span>{formatDate(invoiceData.invoiceDate)}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-semibold">
                    {formatDate(invoiceData.dueDate)}
                  </span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      invoiceData.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : invoiceData.status === "Sent"
                        ? "bg-blue-100 text-blue-800"
                        : invoiceData.status === "Overdue"
                        ? "bg-red-100 text-red-800"
                        : invoiceData.status === "Cancelled"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {invoiceData.status}
                  </span>
                </div>
                {invoiceData.reference && (
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-600">Reference:</span>
                    <span>{invoiceData.reference}</span>
                  </div>
                )}
                {invoiceData.projectName && (
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-600">Project:</span>
                    <span>{invoiceData.projectName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
              Bill To:
            </h3>
            <div className="text-gray-800">
              <p className="font-semibold text-lg">{clientData.clientName}</p>
              {clientData.clientCompany && (
                <p className="text-gray-600">{clientData.clientCompany}</p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                {clientData.clientAddress}
              </p>
              <p className="text-sm text-gray-600">{clientData.clientEmail}</p>
              {clientData.clientPhone && (
                <p className="text-sm text-gray-600">
                  {clientData.clientPhone}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="text-left py-3 px-4 font-semibold">
                    Description
                  </th>
                  <th className="text-right py-3 px-4 font-semibold w-20">
                    Qty
                  </th>
                  <th className="text-right py-3 px-4 font-semibold w-28">
                    Unit Price
                  </th>
                  {items.some((item) => item.discount > 0) && (
                    <th className="text-right py-3 px-4 font-semibold w-24">
                      Discount
                    </th>
                  )}
                  {items.some((item) => item.tax > 0) && (
                    <th className="text-right py-3 px-4 font-semibold w-24">
                      Tax
                    </th>
                  )}
                  <th className="text-right py-3 px-4 font-semibold w-32">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="py-3 px-4 border-b border-gray-200">
                      <div className="font-medium text-gray-800">
                        {item.description || "Untitled Item"}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 text-right">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 text-right">
                      {formatCurrency(item.rate)}
                    </td>
                    {items.some((i) => i.discount > 0) && (
                      <td className="py-3 px-4 border-b border-gray-200 text-right text-red-600">
                        {item.discountType === "percentage"
                          ? `${item.discount}%`
                          : formatCurrency(item.discount)}
                      </td>
                    )}
                    {items.some((i) => i.tax > 0) && (
                      <td className="py-3 px-4 border-b border-gray-200 text-right">
                        {item.taxType === "percentage"
                          ? `${item.tax}%`
                          : formatCurrency(item.tax)}
                      </td>
                    )}
                    <td className="py-3 px-4 border-b border-gray-200 text-right font-semibold">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>
                {totals.discountTotal > 0 && (
                  <div className="flex justify-between py-2 text-red-600">
                    <span>Discount:</span>
                    <span className="font-semibold">
                      -{formatCurrency(totals.discountTotal)}
                    </span>
                  </div>
                )}
                {totals.taxTotal > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-semibold">
                      {formatCurrency(totals.taxTotal)}
                    </span>
                  </div>
                )}
                <div className="border-t-2 border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between py-2">
                    <span className="text-lg font-bold text-gray-800">
                      TOTAL:
                    </span>
                    <span className="text-lg font-bold text-blue-900">
                      {formatCurrency(totals.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {invoiceData.notes && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Notes:
              </h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {invoiceData.notes}
              </p>
            </div>
          )}

          {/* Terms & Conditions */}
          {invoiceData.terms && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Terms & Conditions:
              </h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {invoiceData.terms}
              </p>
            </div>
          )}

          {/* Payment Details */}
          {senderData.bankName && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Payment Details:
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Bank:</span>
                  <span className="ml-2 font-medium">
                    {senderData.bankName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Account Name:</span>
                  <span className="ml-2 font-medium">
                    {senderData.accountName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Account Number:</span>
                  <span className="ml-2 font-medium">
                    {senderData.accountNumber}
                  </span>
                </div>
                {senderData.swiftCode && (
                  <div>
                    <span className="text-gray-600">SWIFT/IBAN:</span>
                    <span className="ml-2 font-medium">
                      {senderData.swiftCode}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Signature Block */}
          {invoiceData.signatureName && (
            <div className="mt-16">
              <div className="border-t-2 border-gray-400 w-64">
                <p className="text-sm text-gray-800 font-semibold mt-2">
                  {invoiceData.signatureName}
                </p>
                <p className="text-xs text-gray-600">
                  {invoiceData.signatureTitle}
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoicePreview;
