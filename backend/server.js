require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected test"))
  .catch(err => console.error(err));

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
    freelancerName: String,
    clientName: String,
    amount: Number,
    date: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" }
});

//const Invoice = mongoose.model('Invoice', invoiceSchema);

const Invoice = require("./models/Invoice");

// API Routes
app.get('/', (req, res) => {
    res.send("Freelancers' Tax Management API");
});

// Create Invoice
app.post('/invoices', async (req, res) => {
    try {
        const invoice = new Invoice(req.body);
        await invoice.save();
        res.status(201).json(invoice);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get All Invoices
app.get('/invoices', async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const path = require("path");
const fs = require("fs");

app.get("/generate-invoice/:id", async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        const pdfPath = await invoice.generateInvoicePDF();

        if (!fs.existsSync(pdfPath)) {
            return res.status(500).json({ message: "PDF generation failed" });
        }

        res.download(pdfPath, path.basename(pdfPath)); // Allow direct download
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


