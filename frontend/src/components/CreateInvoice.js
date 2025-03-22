import React, { useState } from "react";
import { createInvoice } from "../utils/api";

const CreateInvoice = () => {
  const [form, setForm] = useState({ clientName: "", amount: 0, items: [] });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    setForm({ ...form, items: [...form.items, { description: "", value: 0, qty: 1, taxRate: 0 }] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createInvoice(form).then(() => alert("Invoice created!"));
  };

  return (
    <div>
      <h2>Create Invoice</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="clientName" placeholder="Client Name" onChange={handleChange} required />
        <input type="number" name="amount" placeholder="Total Amount" onChange={handleChange} required />
        
        <h3>Items</h3>
        {form.items.map((item, index) => (
          <div key={index}>
            <input type="text" placeholder="Description" />
            <input type="number" placeholder="Value" />
            <input type="number" placeholder="Qty" />
            <input type="number" placeholder="Tax Rate" />
          </div>
        ))}
        
        <button type="button" onClick={handleAddItem}>Add Item</button>
        <button type="submit">Create Invoice</button>
      </form>
    </div>
  );
};

export default CreateInvoice;
