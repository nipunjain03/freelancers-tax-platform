import React, { useState } from "react";
import axios from "axios";

const CreateInvoice = () => {
    const [invoice, setInvoice] = useState({
        invoiceNumber: "",
        fromContact: "",
        fromEmail: "",
        fromPhone: "",
        billToName: "",
        billToEmail: "",
        billToPhone: "",
        items: [
            { description: "", qty: 1, value: 0, taxRate: 0 }
        ],
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e, field) => {
        let value = e.target.value;
        
        if (field === "invoiceNumber") {
            value = value.replace(/\D/g, ""); // Allow only numbers
        }
        
        setInvoice({ ...invoice, [field]: value });
    };

    const handleItemChange = (e, index, field) => {
        const { value } = e.target;
        const updatedItems = [...invoice.items];

        if (!updatedItems[index]) return;
        updatedItems[index][field] =
            ["qty", "value", "taxRate"].includes(field) ? Number(value) || 0 : value;

        setInvoice({ ...invoice, items: updatedItems });
    };

    const handleAddItem = () => {
        setInvoice({
            ...invoice,
            items: [...invoice.items, { description: "", qty: 1, value: 0, taxRate: 0 }],
        });
    };

    const handleRemoveItem = (index) => {
        const updatedItems = invoice.items.filter((_, i) => i !== index);
        setInvoice({ ...invoice, items: updatedItems });
    };

    const calculateTotal = (item) =>
        ((item.qty * item.value) + ((item.qty * item.value) * item.taxRate / 100)).toFixed(2);

    const grandTotal = invoice.items
        .reduce((sum, item) => sum + parseFloat(calculateTotal(item)), 0)
        .toFixed(2);

    const validateFields = () => {
        let validationErrors = {};
        if (!invoice.invoiceNumber.trim()) validationErrors.invoiceNumber = "Invoice Number is required.";
        if (!invoice.fromContact.trim()) validationErrors.fromContact = "From Name is required.";
        if (!invoice.fromEmail.trim()) validationErrors.fromEmail = "From Email is required.";
        if (!invoice.fromPhone.trim()) validationErrors.fromPhone = "From Phone is required.";
        if (!invoice.billToName.trim()) validationErrors.billToName = "To Name is required.";
        if (!invoice.billToEmail.trim()) validationErrors.billToEmail = "To Email is required.";
        if (!invoice.billToPhone.trim()) validationErrors.billToPhone = "To Phone is required.";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleCreateInvoice = async () => {
        if (!validateFields()) return;

        try {
            const response = await axios.post("http://localhost:5000/invoices", invoice);
            if (response.status === 201) {
                const { _id } = response.data;
                window.open(`http://localhost:5000/generate-invoice/${_id}`, "_blank");
            } else {
                alert("Failed to create invoice.");
            }
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h2 style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "10px" }}>Create Invoice</h2>

            {/* Invoice Number */}
            <div style={{ marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold" }}>Invoice Number *</label>
                <input
                    type="text"
                    value={invoice.invoiceNumber}
                    onChange={(e) => handleInputChange(e, "invoiceNumber")}
                    placeholder="Enter Invoice Number"
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
                {errors.invoiceNumber && <p style={{ color: "red", marginTop: "5px" }}>{errors.invoiceNumber}</p>}
            </div>

            {/* From & Bill To Section */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", border: "1px solid #000", padding: "10px" }}>
                {/* From Section */}
                <div style={{ flex: 1 }}>
                    <h3>From</h3>
                    <input type="text" value={invoice.fromContact} onChange={(e) => handleInputChange(e, "fromContact")} placeholder="Contact Name" />
                    {errors.fromContact && <p style={{ color: "red" }}>{errors.fromContact}</p>}

                    <input type="text" value={invoice.fromEmail} onChange={(e) => handleInputChange(e, "fromEmail")} placeholder="Email" />
                    {errors.fromEmail && <p style={{ color: "red" }}>{errors.fromEmail}</p>}

                    <input type="text" value={invoice.fromPhone} onChange={(e) => handleInputChange(e, "fromPhone")} placeholder="Phone" />
                    {errors.fromPhone && <p style={{ color: "red" }}>{errors.fromPhone}</p>}
                </div>

                {/* Bill To Section */}
                <div style={{ flex: 1 }}>
                    <h3>Bill To</h3>
                    <input type="text" value={invoice.billToName} onChange={(e) => handleInputChange(e, "billToName")} placeholder="Name" />
                    {errors.billToName && <p style={{ color: "red" }}>{errors.billToName}</p>}

                    <input type="text" value={invoice.billToEmail} onChange={(e) => handleInputChange(e, "billToEmail")} placeholder="Email" />
                    {errors.billToEmail && <p style={{ color: "red" }}>{errors.billToEmail}</p>}

                    <input type="text" value={invoice.billToPhone} onChange={(e) => handleInputChange(e, "billToPhone")} placeholder="Phone" />
                    {errors.billToPhone && <p style={{ color: "red" }}>{errors.billToPhone}</p>}
                </div>
            </div>

            {/* Items Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Value</th>
                        <th>Tax %</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item, index) => (
                        <tr key={index}>
                            <td><input type="text" value={item.description} onChange={(e) => handleItemChange(e, index, "description")} /></td>
                            <td><input type="number" value={item.qty} onChange={(e) => handleItemChange(e, index, "qty")} /></td>
                            <td><input type="number" value={item.value} onChange={(e) => handleItemChange(e, index, "value")} /></td>
                            <td><input type="number" value={item.taxRate} onChange={(e) => handleItemChange(e, index, "taxRate")} /></td>
                            <td>{calculateTotal(item)}</td>
                            <td><button onClick={() => handleRemoveItem(index)}>Remove</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Grand Total & Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={handleAddItem} style={{ padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer" }}>Add Item</button>
                <h3>Grand Total: {grandTotal}</h3>
                <button onClick={handleCreateInvoice} style={{ padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>Create Invoice</button>
            </div>
        </div>
    );
};

export default CreateInvoice;
