import React, { useEffect, useState } from "react";
import { getInvoiceById, generateInvoicePDF, updateInvoice } from "../utils/api";
import { useParams } from "react-router-dom";

const InvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getInvoiceById(id).then((res) => {
      setInvoice(res.data);
      setStatus(res.data.status);
    });
  }, [id]);

  const handleGeneratePDF = () => {
    generateInvoicePDF(id).then((res) => {
      const blob = new Blob([res.data.pdfContent], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = res.data.pdfName;
      link.click();
    });
  };

  const handleUpdateStatus = () => {
    updateInvoice(id, { status }).then(() => alert("Status updated"));
  };

  if (!invoice) return <p>Loading...</p>;

  return (
    <div>
      <h2>Invoice #{invoice._id}</h2>
      <p><strong>Client:</strong> {invoice.clientName}</p>
      <p><strong>Status:</strong>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button onClick={handleUpdateStatus}>Update</button>
      </p>
      <button onClick={handleGeneratePDF}>Download PDF</button>
    </div>
  );
};

export default InvoiceDetails;
