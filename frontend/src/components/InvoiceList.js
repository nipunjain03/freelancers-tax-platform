import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [billToFilter, setBillToFilter] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/invoices") // Ensure your backend is running on port 5000
      .then((res) => res.json())
      .then((data) => setInvoices(data))
      .catch((err) => console.error("Error fetching invoices:", err));
  }, []);

  // Function to calculate total from items array
  const calculateTotal = (items) => {
    return items?.reduce((total, item) => {
      return total + (item.value || 0) * (item.qty || 0) * (1 + (item.taxRate || 0) / 100);
    }, 0).toFixed(2);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      {/* Centered Heading with Hyperlink */}
      <h2 style={{ textAlign: "center" }}>
        <Link to="/">Invoice List</Link>
      </h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Invoice..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
      />

      {/* Bill To Filter */}
      <label style={{ fontWeight: "bold" }}>Bill To:</label>
      <input
        type="text"
        placeholder="Filter by Client Name"
        value={billToFilter}
        onChange={(e) => setBillToFilter(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "15px" }}
      />

      {/* Invoice Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4a460", textAlign: "left" }}>
            <th style={tableHeaderStyle}>Invoice #</th>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoices
            .filter((invoice) => {
              const invoiceNumber = invoice.invoiceNumber || "";
              const billToName = invoice.billTo || ""; // Ensure billTo is always a string
              return (
                invoiceNumber.toLowerCase().includes(search.toLowerCase()) &&
                billToName.toLowerCase().includes(billToFilter.toLowerCase())
              );
            })
            .map((invoice) => (
              <tr key={invoice._id} style={tableRowStyle}>
                <td>
                  <Link to={`/invoice/${invoice._id}`} style={{ textDecoration: "none", color: "blue" }}>
                    {invoice.invoiceNumber || "N/A"}
                  </Link>
                </td>
                <td>{invoice.date || "N/A"}</td>
                <td>{invoice.status || "Pending"}</td>
                <td>₹{calculateTotal(invoice.items)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

// CSS Styles
const tableHeaderStyle = {
  padding: "10px",
  borderBottom: "2px solid #ddd",
  backgroundColor: "#f4a460", // Light brown
};

const tableRowStyle = {
  borderBottom: "1px solid #ddd",
  padding: "8px",
};

export default InvoiceList;
