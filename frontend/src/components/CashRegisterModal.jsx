import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { saveTransaction } from "../controllers/transactions.controller";
import NumberPad from "./NumberPad"; // Import NumberPad component

const CashRegisterModal = ({ total, currency, onTransactionComplete, onClose }) => {
  const [amountReceived, setAmountReceived] = useState("");
  const [change, setChange] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handleAmountChange = (value) => {
    if (value === "." && amountReceived.includes(".")) return; // Prevent multiple decimal points

    const newAmount = amountReceived + value;
    setAmountReceived(newAmount);
    const numericValue = parseFloat(newAmount);
    setChange(numericValue - total);
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
    if (!total || total <= 0) {
      toast.error("Invalid transaction total");
      return;
    }

    if (!amountReceived || amountReceived <= 0) {
      toast.error("Invalid amount received");
      return;
    }

    if (!paymentMethod || paymentMethod === "cash") {
      toast.error("Invalid payment method");
      return;
    }

    const transactionDetails = {
      total,
      amountReceived: paymentMethod === "cash" ? parseFloat(amountReceived) : total,
      change: paymentMethod === "cash" ? change : 0,
      paymentMethod,
    };

    try {
      toast.loading("Processing transaction...");
      const response = await saveTransaction(transactionDetails);
      if (response.status === 200) {
        toast.dismiss();
        toast.success("Transaction successful!");
        onTransactionComplete(transactionDetails);
        onClose();

        // Open print receipt window
        const receiptWindow = window.open(
          "/print-receipt",
          "_blank",
          "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400"
        );
        if (receiptWindow) {
          receiptWindow.onload = (e) => {
            setTimeout(() => {
              if (receiptWindow) {
                receiptWindow.print();
              }
            }, 400);
          };
        }
      }
    } catch (error) {
      console.error(error);
      toast.dismiss();
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
