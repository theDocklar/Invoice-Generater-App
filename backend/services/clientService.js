import Client from "../models/clientModel.js";

const clientService = {
  // Create a new client
  async createClient(clientData) {
    const client = new Client(clientData);
    await client.save();
    return client;
  },

  // Get all clients
  async getAllClients() {
    const clients = await Client.find().sort({ createdAt: -1 });
    return clients;
  },

  // Get client by ID
  async getClientById(clientId) {
    const client = await Client.findById(clientId);
    if (!client) {
      throw new Error("Client not found");
    }
    return client;
  },

  // Update client
  async updateClient(clientId, updateData) {
    const client = await Client.findByIdAndUpdate(clientId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!client) {
      throw new Error("Client not found");
    }
    return client;
  },

  // Delete client
  async deleteClient(clientId) {
    const client = await Client.findByIdAndDelete(clientId);
    if (!client) {
      throw new Error("Client not found");
    }
    return client;
  },
};

export default clientService;
