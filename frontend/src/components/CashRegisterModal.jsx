import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import { toast } from "react-hot-toast";
import apiClient from "../helpers/ApiClient.js";
import NumberPad from "./NumberPad";

const CashRegisterModal = ({ total, currency, onTransactionComplete, onClose }) => {
  total = total || 0;
  currency = currency || "";
  onTransactionComplete = onTransactionComplete || (() => {});
  onClose = onClose || (() => {});

  const [amountReceived, setAmountReceived] = useState("");
  const [change, setChange] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleAmountChange = (value) => {
    if (value === "." && amountReceived.includes(".")) return;
    if (typeof value !== "string") {
      throw new Error("Amount change value must be a string");
    }
    const newAmount = amountReceived + value;
    if (newAmount === null) {
      throw new Error("Amount change value cannot be null");
    }
    if (value === "submit") {
      const numericValue = parseFloat(newAmount);
      if (isNaN(numericValue)) {
        throw new Error("Amount change value is not a valid number");
      }
      setChange(numericValue - total);
      handleTransactionComplete();
    } else {
      setAmountReceived(newAmount);
      const numericValue = parseFloat(newAmount);
      if (isNaN(numericValue)) {
        throw new Error("Amount change value is not a valid number");
      }
      setChange(numericValue - total);
    }
  };

  const handleClear = () => {
    setAmountReceived("");
    setChange(-total);
  };

  const handleDelete = () => {
    const newAmount = amountReceived.slice(0, -1);
    setAmountReceived(newAmount);
    const numericValue = parseFloat(newAmount);
    setChange(numericValue - total);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleTransactionComplete = async () => {
    try {
      const transactionDetails = {
        total,
        amountReceived: paymentMethod === "cash" ? parseFloat(amountReceived) : total,
        change: paymentMethod === "cash" ? change : 0,
        paymentMethod,
      };
  
      const response = await apiClient.post('/transactions', transactionDetails);
  
      if (response && response.status === 200) {
        toast.success("Transaction successful!");
        onTransactionComplete && onTransactionComplete(transactionDetails);
        onClose && onClose();
        navigate("/success-page"); // Replace with your success route
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error("Transaction failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericValue = parseFloat(amountReceived);
    if (isNaN(numericValue) && paymentMethod === "cash") {
      toast.error("Invalid amount received");
      return;
    }
    handleTransactionComplete();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Cash Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Total Amount</label>
            <p className="text-lg">
              {currency} {total.toFixed(2)}
            </p>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Payment Method</label>
            <div className="flex justify-around">
              <button 
                type="button" 
                className={`btn ${paymentMethod === "cash" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => handlePaymentMethodChange("cash")}
              >
                Cash
              </button>
              <button 
                type="button" 
                className={`btn ${paymentMethod === "credit" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => handlePaymentMethodChange("credit")}
              >
                Credit Card
              </button>
            </div>
          </div>
          {paymentMethod === "cash" && (
            <>
              <div className="mb-4">
                <label className="block mb-2">Amount Received</label>
                <input
                  type="text"
                  value={amountReceived}
                  readOnly
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mb-4">
                <NumberPad onInput={handleAmountChange} onClear={handleClear} onDelete={handleDelete} />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Change</label>
                <p className="text-lg">
                  {currency} {change.toFixed(2)}
                </p>
              </div>
            </>
          )}
          <div className="flex justify-end space-x-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Complete Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashRegisterModal;
