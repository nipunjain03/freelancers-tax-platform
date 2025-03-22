import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const InvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/invoices/${id}`)
      .then((res) => setInvoice(res.data))
      .catch((err) => {
        console.error("Error fetching invoice:", err);
        setError("Invoice not found.");
      });
  }, [id]);

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  if (!invoice) return <h3>Loading...</h3>;

  const handleInputChange = (e, field) => {
    setInvoice({ ...invoice, [field]: e.target.value });
  };

  const handleFromChange = (e, field) => {
    setInvoice((prevInvoice) => ({
        ...prevInvoice,
        [field === "name" ? "fromContact" : 
         field === "email" ? "fromEmail" : 
         "fromPhone"]: e.target.value
    }));
};


const handleItemChange = (e, index, field) => {
    const { value } = e.target;

    // Ensure items array exists before modifying
    if (!invoice.items || !Array.isArray(invoice.items)) {
        console.error("Error: items array is not initialized.");
        return;
    }

    // Ensure the index is within the valid range
    if (index < 0 || index >= invoice.items.length) {
        console.error(`Error: Invalid index ${index}`);
        return;
    }

    // Create a new array to avoid mutating state directly
    const updatedItems = [...invoice.items];

    // Ensure item exists before modifying
    if (!updatedItems[index]) {
        updatedItems[index] = { description: "", qty: 1, value: 0, taxRate: 0 };
    }

    // Update the specific field in the selected item
    updatedItems[index][field] = field === "qty" || field === "value" || field === "taxRate" 
        ? Number(value) || 0  // Convert to number for calculations
        : value;  // Keep string fields as they are

    // Update state with the new items array
    setInvoice({ ...invoice, items: updatedItems });
};

  const addNewItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: "", qty: 1, value: "", taxRate: "", total: 0 }]
    });
  };

  const deleteItem = (index) => {
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    setInvoice({ ...invoice, items: updatedItems });
  };

  const validateForm = () => {
    for (const item of invoice.items) {
      if (!item.description || !item.qty || !item.value || !item.taxRate) {
        setMessage("Please fill all the fields in the items table.");
        return false;
      }
    }
    return true;
  };

  const updateInvoice = () => {
    if (!validateForm()) return;

    axios.put(`http://localhost:5000/invoices/${id}`, invoice)
      .then(() => setMessage("Invoice updated successfully!"))
      .catch((err) => {
        console.error("Error updating invoice:", err.response || err.message);
        setMessage(`Error updating invoice: ${err.response ? err.response.data : err.message}`);
      });
  };


const calculateGrandTotal = () => {
    return invoice.items.reduce((sum, item) => {
        const total = (item.qty * item.value) + (item.taxRate || 0);
        return sum + total;
    }, 0).toFixed(2); // Ensure 2 decimal places
};

const handleAddItem = () => {
    setInvoice({
        ...invoice,
        items: [
            ...invoice.items,
            {
                description: "",
                qty: 1,        // Default to 1
                value: 0,      // Default to 0
                taxRate: 0,    // Default to 0
            },
        ],
    });
};


  const openPDF = () => {
    window.open(`http://localhost:5000/generate-invoice/${id}`, "_blank");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      
      {/* Invoice Heading */}
      <div style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center", marginBottom: "10px" }}>
        <h2>Invoice Details</h2>
      </div>

      {invoice.invoiceNumber && <p><b>Invoice #:</b> {invoice.invoiceNumber}</p>}

      {/* Bill To & From Section */}
      <div style={{
        display: "flex", justifyContent: "space-between", 
        border: "1px solid #ccc", padding: "10px", marginBottom: "10px"
      }}>
        
        {/* Bill To Section */}
        <div style={{ flex: "1", paddingRight: "20px" }}>
          <h3>Bill To</h3>
          <input 
            type="text" 
            value={invoice.billToName || ""}
            onChange={(e) => handleInputChange(e, "billToName")}
            placeholder="Name"
          />
          <input 
            type="text" 
            placeholder="Email" 
            value={invoice.billToEmail || ""}
            onChange={(e) => handleInputChange(e, "billToEmail")}
          />
          <input 
            type="text" 
            placeholder="Phone" 
            value={invoice.billToPhone || ""}
            onChange={(e) => handleInputChange(e, "billToPhone")}
          />
        </div>

        {/* From Section */}
<div style={{ flex: "1" }}>
  <h3>From</h3>
  <input 
    type="text" 
    value={invoice.fromContact || ""}
    onChange={(e) => handleFromChange(e, "name")}
    placeholder="Name"
  />
  <input 
    type="text" 
    placeholder="Email" 
    value={invoice.fromEmail || ""}
    onChange={(e) => handleFromChange(e, "email")}
  />
  <input 
    type="text" 
    placeholder="Phone" 
    value={invoice.fromPhone || ""}
    onChange={(e) => handleFromChange(e, "phone")}
  />
</div>

      </div>

      {/* Invoice Items Table */}
      <h3>Items</h3>
      <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "lightbrown" }}>
            <th>Description</th>
            <th>Quantity</th>
            <th>Value</th>
            <th>Tax Rate</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
       <td><input type="text" value={item.description || ""} onChange={(e) => handleItemChange(e, index, "description")} /></td>
      <td><input type="number" value={item.qty || 0} onChange={(e) => handleItemChange(e, index, "qty")} /></td>
      <td><input type="number" value={item.value || 0} onChange={(e) => handleItemChange(e, index, "value")} /></td>
      <td><input type="number" value={item.taxRate || 0} onChange={(e) => handleItemChange(e, index, "taxRate")} /></td>
      <td>{(((Number(item.qty) || 0) * (Number(item.value) || 0)) + (Number(item.taxRate) || 0)).toFixed(2)}</td>

              <td>
                <button onClick={() => deleteItem(index)} style={{ backgroundColor: "red", color: "white" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

<div style={{ textAlign: "right", fontWeight: "bold", marginTop: "10px", fontSize: "18px" }}>
  Grand Total: {calculateGrandTotal()}
</div>

      <button 
        onClick={addNewItem} 
        style={{ marginTop: "10px", backgroundColor: "green", color: "white" }}
      >
        Add Item
      </button>

      {/* Update & Generate PDF Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button 
          onClick={updateInvoice} 
          style={{ backgroundColor: "blue", color: "white", marginRight: "10px" }}
        >
          Update
        </button>
        
        <button 
          onClick={openPDF} 
          style={{ backgroundColor: "purple", color: "white" }}
        >
          Generate PDF
        </button>
      </div>

      {/* Display Message */}
      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
};

export default InvoiceDetails;
