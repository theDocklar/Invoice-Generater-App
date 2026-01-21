//packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Utils
import connectDB from "./config/db.js";

// Import Routes
import invoiceRoutes from "./routes/invoiceRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const port = process.env.PORT || 5001;

connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/invoices", invoiceRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
