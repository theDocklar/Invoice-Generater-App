import { useState } from "react";
import Modal from "../components/Modal.jsx";
import Button from "../components/Button.jsx";
import { useToast } from "../components/Toast.jsx";

function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { confirm, showSuccess } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    mobile: "",
    address: "",
  });

  // Sample client data
  const [clients] = useState([
    {
      id: 1,
      name: "John Smith",
      companyName: "Acme Corp",
      email: "john.smith@acmecorp.com",
      mobile: "+1 (555) 123-4567",
      address: "123 Business St, New York, NY 10001",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      companyName: "Tech Solutions Ltd",
      email: "sarah.j@techsolutions.com",
      mobile: "+1 (555) 234-5678",
      address: "456 Innovation Ave, San Francisco, CA 94102",
    },
    {
      id: 3,
      name: "Michael Chen",
      companyName: "Global Industries",
      email: "m.chen@globalindustries.com",
      mobile: "+1 (555) 345-6789",
      address: "789 Corporate Blvd, Chicago, IL 60601",
    },
    {
      id: 4,
      name: "Emily Davis",
      companyName: "StartUp Inc",
      email: "emily@startupinc.com",
      mobile: "+1 (555) 456-7890",
      address: "321 Venture Way, Austin, TX 78701",
    },
    {
      id: 5,
      name: "David Wilson",
      companyName: "Enterprise Group",
      email: "d.wilson@enterprisegroup.com",
      mobile: "+1 (555) 567-8901",
      address: "654 Commerce Dr, Boston, MA 02101",
    },
  ]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New client data:", formData);
    // Here you would typically add the client to your state or send to API
    setIsModalOpen(false);
    setFormData({
      name: "",
      companyName: "",
      email: "",
      mobile: "",
      address: "",
    });
  };

  // Handle delete with confirmation
  const handleDelete = async (clientId, clientName) => {
    const confirmed = await confirm(
      `Are you sure you want to delete ${clientName}?`
    );
    if (confirmed) {
      // Here you would call your API to delete the client
      console.log("Deleting client:", clientId);
      showSuccess(`${clientName} has been deleted successfully!`);
    }
  };

  // Filter clients based on search
  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.companyName.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.mobile.includes(searchQuery)
    );
  });

  return (
    <>
      <div className="p-8">
        {/* Page Title and Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Clients</h1>
          <Button variant="black" onClick={() => setIsModalOpen(true)}>
            + Add New Client
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, company, email, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {client.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {client.mobile}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                      {client.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="small">
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(client.id, client.name)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Results Summary */}
        {filteredClients.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredClients.length} of {clients.length} clients
          </div>
        )}
      </div>

      {/* Add New Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Client"
        size="medium"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter client name"
            />
          </div>

          {/* Company Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter company name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="client@example.com"
            />
          </div>

          {/* Mobile Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile No. *
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter complete address"
            />
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Client</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Clients;
