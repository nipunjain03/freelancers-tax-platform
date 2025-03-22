import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import InvoiceList from "./components/InvoiceList";
import CreateInvoice from "./components/CreateInvoice";
import InvoiceDetails from "./components/InvoiceDetails";
import "./Navbar.css"; // Import the CSS file

const App = () => {
  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav className="navbar">
          <ul className="menu">
            <li>
              <Link to="/invoices">View/Update Invoice</Link>
            </li>
            <li>
              <Link to="/create-invoice">Create Invoice</Link>
            </li>
          </ul>
        </nav>

        {/* Routing Setup */}
        <Routes>
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/invoice/:id" element={<InvoiceDetails />} />
          <Route path="/" element={<InvoiceList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
