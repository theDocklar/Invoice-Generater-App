import express from "express";
import {
  generateInvoicePDF,
  previewInvoicePDF,
} from "../controllers/pdfController.js";
import {
  createInvoice,
  getNextInvoiceNumber,
  getAllInvoices,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/next-invoice-number", getNextInvoiceNumber);
router.post("/create-invoice", createInvoice);
router.get("/all-invoices", getAllInvoices);
router.get("/download/:id", generateInvoicePDF);
router.get("/preview/:id", previewInvoicePDF);

export default router;
