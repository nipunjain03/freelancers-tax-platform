import React, { useEffect, useState } from "react";
import { getInvoices } from "../utils/api";
import { Link } from "react-router-dom";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getInvoices().then((res) => setInvoices(res.data));
  }, []);

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.billToName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Invoices</h2>
      <input
        type="text"
        placeholder="Search by client name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Date</th>
            <th>Client</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((inv) => (
            <tr key={inv._id}>
              <td><Link to={`/invoice/${inv._id}`}>{inv._id}</Link></td>
              <td>{new Date(inv.date).toLocaleDateString()}</td>
              <td>{inv.clientName}</td>
              <td>{inv.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
