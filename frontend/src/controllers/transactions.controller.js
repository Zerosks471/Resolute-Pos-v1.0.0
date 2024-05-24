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
