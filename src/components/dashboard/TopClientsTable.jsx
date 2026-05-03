function TopClientsTable({ clients = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoices
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Revenue
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client, index) => (
            <tr key={client.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <span
                    className={`
                    inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold
                    ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : index === 1
                        ? "bg-gray-100 text-gray-800"
                        : index === 2
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-50 text-gray-600"
                    }
                  `}
                  >
                    {index + 1}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {client.name}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-700">
                  {client.invoiceCount}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right">
                <div className="text-sm font-semibold text-gray-900">
                  $
                  {client.revenue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopClientsTable;
