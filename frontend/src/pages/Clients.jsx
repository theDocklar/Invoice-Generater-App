import { useState, useEffect } from "react";
import Modal from "../components/Modal.jsx";
import Button from "../components/Button.jsx";
import { useToast } from "../components/Toast.jsx";
import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
} from "../api/clientApi.js";

function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { confirm, showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    mobile: "",
    address: "",
  });

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch all clients
  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await getAllClients();
      if (response.success) {
        setClients(response.data || []);
      }
    } catch (error) {
      console.error(error);
      // Set empty array for new users - don't show error
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update existing client
        const response = await updateClient(editingClientId, formData);
        if (response.success) {
          showSuccess("Client updated successfully!");
          fetchClients();
        }
      } else {
        // Create new client
        const response = await createClient(formData);
        if (response.success) {
          showSuccess("Client created successfully!");
          fetchClients();
        }
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      showError(error.message || "Failed to save client");
    }
  };

  // Handle edit
  const handleEdit = (client) => {
    setIsEditMode(true);
    setEditingClientId(client._id);
    setFormData({
      name: client.name,
      companyName: client.companyName || "",
      email: client.email,
      mobile: client.mobile,
      address: client.address || "",
    });
    setIsModalOpen(true);
  };

  // Handle delete with confirmation
  const handleDelete = async (clientId, clientName) => {
    const confirmed = await confirm(
      `Are you sure you want to delete ${clientName}?`,
    );
    if (confirmed) {
      try {
        const response = await deleteClient(clientId);
        if (response.success) {
          showSuccess(`${clientName} has been deleted successfully!`);
          fetchClients();
        }
      } catch (error) {
        showError(error.message || "Failed to delete client");
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      companyName: "",
      email: "",
      mobile: "",
      address: "",
    });
    setIsEditMode(false);
    setEditingClientId(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Filter clients based on search
  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      (client.companyName &&
        client.companyName.toLowerCase().includes(searchLower)) ||
      client.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="p-8">
        {/* Page Title and Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Clients</h1>
          <Button
            variant="black"
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            + Add New Client
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, company, or email..."
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
              {isLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading clients...
                  </td>
                </tr>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr
                    key={client._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {client.companyName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {client.mobile}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                      {client.address || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => handleEdit(client)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(client._id, client.name)}
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

      {/* Add/Edit Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={isEditMode ? "Edit Client" : "Add New Client"}
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
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
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
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
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
              onClick={handleModalClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditMode ? "Update Client" : "Add Client"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Clients;
