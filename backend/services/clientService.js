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

  // Find client by email or create new one
  async findOrCreateClient(clientData) {
    let client = await Client.findOne({ email: clientData.email });

    if (client) {
      return { client, isNew: false };
    }

    const newClientData = {
      name: clientData.name,
      companyName: clientData.company || "",
      email: clientData.email,
      mobile: clientData.phone,
      address: clientData.address || "",
    };

    client = new Client(newClientData);
    await client.save();

    return { client, isNew: true };
  },
};

export default clientService;
