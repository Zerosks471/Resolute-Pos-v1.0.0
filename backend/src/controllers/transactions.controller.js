import axios from "axios";
import { VITE_BACKEND_URL } from "../config/config";

export const saveTransaction = async (transaction) => {
  try {
    const response = await axios.post(`${VITE_BACKEND_URL}/transactions`, transaction);
    return response;
  } catch (error) {
    console.error("Error saving transaction:", error);
    throw error;
  }
};
