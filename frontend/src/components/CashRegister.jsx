import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { saveTransaction } from "../controllers/transactions.controller";
import NumberPad from "./NumberPad"; // Import NumberPad component

const CashRegister = ({ total, currency, onTransactionComplete }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericValue = parseFloat(amountReceived);
    if (isNaN(numericValue) && paymentMethod === "cash") {
      toast.error("Invalid amount received");
      return;
    }

    try {
      toast.loading("Processing transaction...");
      const response = await saveTransaction({ 
        total, 
        amountReceived: paymentMethod === "cash" ? numericValue : total, 
        change: paymentMethod === "cash" ? change : 0, 
        paymentMethod 
      });
      if (response.status === 200) {
        toast.dismiss();
        toast.success("Transaction successful!");
        onTransactionComplete();
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Transaction failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-[420px] p-4 border rounded-lg shadow-md text-center">
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
        <button type="submit" className="btn btn-primary w-full">
          Complete Transaction
        </button>
      </form>
    </div>
  );
};

export default CashRegister;
