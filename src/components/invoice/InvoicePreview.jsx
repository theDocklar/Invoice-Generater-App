function InvoicePreview({
  invoiceData,
  senderData,
  clientData,
  items,
  totals,
}) {
  const formatCurrency = (amount) => {
    const symbol =
      invoiceData.currency === "USD"
        ? "$"
        : invoiceData.currency === "EUR"
        ? "€"
        : invoiceData.currency === "GBP"
        ? "£"
        : "Rs.";
    const roundedAmount = Math.round(Number(amount) || 0);
    return `${symbol}${roundedAmount.toLocaleString("en-US")}`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-100 h-full overflow-auto p-8">
      {/* A4 Container */}
      <div
        className="max-w-[210mm] mx-auto bg-white shadow-xl"
        style={{ minHeight: "297mm" }}
      >
        {/* Invoice Content with padding */}
        <div className="p-16">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-1">INVOICE</h1>
              <p className="text-gray-600 text-sm">
                #{invoiceData.invoiceNumber}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-bold text-gray-900">theBOAT</h2>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-12 mb-10">
            {/* Left Column - Invoice Details */}
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-600">Date</span>
                <span className="text-gray-900">
                  {formatDate(invoiceData.invoiceDate)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-600">Due Date</span>
                <span className="text-gray-900">
                  {formatDate(invoiceData.dueDate)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-600">Payment Terms</span>
                <span className="text-gray-900">Due Upon Receipt</span>
              </div>
            </div>

            {/* Right Column - Bill To */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Bill To
              </h3>
              <div className="text-gray-900 text-sm">
                {clientData.name && (
                  <p className="font-medium">{clientData.name}</p>
                )}
                {clientData.company && <p>{clientData.company}</p>}
                {clientData.address && (
                  <p className="text-gray-600">{clientData.address}</p>
                )}
                {clientData.email && (
                  <p className="text-gray-600">{clientData.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Balance Due Section */}
          <div className="mb-8">
            <div className="flex items-baseline gap-3">
              <h3 className="text-lg font-medium text-gray-600">Balance Due</h3>
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(totals.grandTotal)}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="text-left py-3 font-semibold text-sm text-gray-900">
                    Description
                  </th>
                  <th className="text-right py-3 font-semibold text-sm text-gray-900 w-20">
                    Qty
                  </th>
                  <th className="text-right py-3 font-semibold text-sm text-gray-900 w-28">
                    Unit price
                  </th>
                  <th className="text-right py-3 font-semibold text-sm text-gray-900 w-28">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-3 text-sm text-gray-900">
                      {item.description || "Untitled Item"}
                    </td>
                    <td className="py-3 text-sm text-gray-900 text-right">
                      {item.quantity === Math.floor(item.quantity)
                        ? item.quantity
                        : "N/A"}
                    </td>
                    <td className="py-3 text-sm text-gray-900 text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-3 text-sm text-gray-900 text-right font-medium">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Terms and Totals Section */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            {/* Left - Terms */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Terms
              </h3>
              <div className="text-xs text-gray-700 space-y-2">
                <p>
                  {invoiceData.notes ||
                    "Payment is due within 15 days of the invoice date"}
                </p>
                <p className="mt-4">
                  Only Bank Transfers will be accepted as Payment Methods
                </p>
                <div className="mt-6">
                  <p className="font-semibold text-gray-900 mb-1">
                    Account Details:
                  </p>
                  <p>{senderData.accountNumber || "1550120134349"}</p>
                  <p>{senderData.accountName || "The Boat Ceylon (Pvt) Ltd"}</p>
                  <p>{senderData.bankName || "Hatton National Bank"}</p>
                  <p>Kochikade</p>
                </div>
              </div>
            </div>

            {/* Right - Totals */}
            <div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 text-right">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>
                {totals.discountTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-gray-900 text-right">
                      -{formatCurrency(totals.discountTotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="text-gray-900 text-right">
                    {formatCurrency(totals.grandTotal)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="font-bold text-gray-900">Balance Due:</span>
                  <span className="font-bold text-gray-900 text-right">
                    {formatCurrency(totals.grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-6 text-xs text-gray-600">
            <p>
              This invoice reflects services rendered remotely as per prior
              agreement.
            </p>
            <p className="mt-1">
              If you have any questions regarding this invoice, please contact
              us at the email above.
            </p>
            <p className="mt-1">Thank you for your business.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoicePreview;
