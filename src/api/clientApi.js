const API_URL = "http://localhost:5001/api/clients";

// Create a new client
export const createClient = async (clientData) => {
  try {
    const response = await fetch(`${API_URL}/create-client`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create client");
    }

    return data;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

// Get all clients
export const getAllClients = async () => {
  try {
    const response = await fetch(`${API_URL}/all-clients`, {
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch clients");
    }

    return data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

// Get client by ID
export const getClientById = async (clientId) => {
  try {
    const response = await fetch(`${API_URL}/${clientId}`, {
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch client");
    }

    return data;
  } catch (error) {
    console.error("Error fetching client:", error);
    throw error;
  }
};

// Update client
export const updateClient = async (clientId, clientData) => {
  try {
    const response = await fetch(`${API_URL}/${clientId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update client");
    }

    return data;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

// Delete client
export const deleteClient = async (clientId) => {
  try {
    const response = await fetch(`${API_URL}/${clientId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete client");
    }

    return data;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};
