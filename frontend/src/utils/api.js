import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Change if backend is hosted

export const getInvoices = async () => axios.get(`${API_BASE_URL}/invoices`);
export const getInvoiceById = async (id) => axios.get(`${API_BASE_URL}/invoices/${id}`);
export const createInvoice = async (data) => axios.post(`${API_BASE_URL}/invoices`, data);
export const updateInvoice = async (id, data) => axios.put(`${API_BASE_URL}/invoices/${id}`, data);
export const generateInvoicePDF = async (id) => axios.get(`${API_BASE_URL}/generate-invoice/${id}`);
