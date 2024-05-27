import axios from "axios";
import { VITE_BACKEND_URL } from "../config/config";
import CashRegisterModel from "../components/CashRegisterModal.jsx";

export const saveTransaction = async (transaction) =>
  axios.post(`${VITE_BACKEND_URL}/transactions`, transaction).catch((error) => {
    console.error("Error saving transaction:", error);
    throw error;
  });

export const getTransactions = async () =>
  axios.get(`${VITE_BACKEND_URL}/transactions`).catch((error) => {
    console.error("Error fetching transactions:", error);
    throw error;
  });

export const getTransaction = async (id) => 
  axios.get(`${VITE_BACKEND_URL}/transactions/${id}`).catch((error) => {
    console.error("Error fetching transaction:", error);
    throw error;
  });

export const deleteTransaction = async (id) =>
  axios.delete(`${VITE_BACKEND_URL}/transactions/${id}`).catch((error) => {
    console.error("Error deleting transaction:", error);
    throw error;
  });

export const updateTransaction = async (id, transaction) =>
  axios.put(`${VITE_BACKEND_URL}/transactions/${id}`, transaction).catch((error) => {
    console.error("Error updating transaction:", error);
    throw error;
  });

export const getTransactionsByDate = async (date) =>
  axios.get(`${VITE_BACKEND_URL}/transactions/date/${date}`).catch((error) => {
    console.error("Error fetching transactions by date:", error);
    throw error;
  });

export const getTransactionsByDateRange = async (startDate, endDate) => 
  axios.get(`${VITE_BACKEND_URL}/transactions/date/${startDate}/${endDate}`).catch((error) => {
    console.error("Error fetching transactions by date range:", error);
    throw error;
  }); 
// Path: backend/src/controllers/transactions.controller.js
// Compare this snippet from frontend/src/components/CashRegisterModal.jsx:

