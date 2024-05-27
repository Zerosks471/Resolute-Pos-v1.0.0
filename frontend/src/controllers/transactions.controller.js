import axios from "axios";
import ApiClient from "../helpers/ApiClient";


export const saveTransaction = async (transaction) => {
  try {
    const response = await axios.post(`${ApiClient}/transactions`, transaction);
    return response;
  } catch (error) {
    console.error("Error saving transaction:", error);
    throw error;
  }
};
export const getTransaction = async (id) => 
  axios.get(`${ApiClient}/transactions/${id}`).catch((error) => {
    console.error("Error fetching transaction:", error);
    throw error;
  });

export const deleteTransaction = async (id) =>
  axios.delete(`${ApiClient}/transactions/${id}`).catch((error) => {
    console.error("Error deleting transaction:", error);
    throw error;
  });

export const updateTransaction = async (id, transaction) =>
  axios.put(`${ApiClient}/transactions/${id}`, transaction).catch((error) => {
    console.error("Error updating transaction:", error);
    throw error;
  });
