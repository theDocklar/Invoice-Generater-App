import express from "express";
import {
  createInvoice,
  getNextInvoiceNumber,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/next-invoice-number", getNextInvoiceNumber);
router.post("/create-invoice", createInvoice);

export default router;
