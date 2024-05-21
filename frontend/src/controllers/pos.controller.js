import ApiClient from "../helpers/ApiClient";

const DRAFTS_KEY = "resolutepos__DRAFTS";

export async function initPOS() {
    try {
      const response = await ApiClient.get("/pos/init");
      return response;
    } catch (error) {
      throw error;
    }
}

export async function createOrder(cart, deliveryType, customerType, customerId, tableId) {
  try {
    const response = await ApiClient.post("/pos/create-order", {
      cart, deliveryType, customerType, customerId, tableId
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function createOrderAndInvoice(cart, deliveryType, customerType, customerId, tableId, netTotal, taxTotal, total) {
  try {
    const response = await ApiClient.post("/pos/create-order-and-invoice", {
      cart, deliveryType, customerType, customerId, tableId,
      netTotal, taxTotal, total
    });
    return response;
  } catch (error) {
    throw error;
  }
}

// drafts
/**
 * @returns {Array}
 *  */ 
export function getDrafts() {
  const draftsString = localStorage.getItem(DRAFTS_KEY);
  const drafts = draftsString ? JSON.parse(draftsString) : [];
  return drafts;
}

/**
 * @param {Array} drafts 
 *  */ 
export function setDrafts(drafts) {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}
// drafts