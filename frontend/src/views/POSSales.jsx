import NumberPad from "../components/NumberPad";
import CashRegister from "../components/CashRegister";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { saveTransaction } from "../controllers/transactions.controller";
import { useState } from "react"; // Add the missing import statement for the useState hook


const POSSales = ({ total, currency, onTransactionComplete }) => {
    const [amountReceived, setAmountReceived] = useState("");
    const [change, setChange] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const navigate = useNavigate(); // Initialize useNavigate hook  to navigate to a different route

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

    const handleSubmit = () => {
        if (amountReceived === "") {
            toast.error("Please enter an amount");
            return;
        }

        const numericValue = parseFloat(amountReceived);
        if (isNaN(numericValue) && paymentMethod === "cash") {
            toast.error("Invalid amount received");
            return;
        }

        handleTransactionComplete();
    };

    const handleTransactionComplete = async () => {
        try {
            const transactionDetails = {
                total,
                amountReceived: paymentMethod === "cash" ? parseFloat(amountReceived) : total,
                change: paymentMethod === "cash" ? change : 0,
                paymentMethod,
            };

            const response = await saveTransaction(transactionDetails);

            if (response.status === 200) {
                toast.success("Transaction successful");
                onTransactionComplete && onTransactionComplete(transactionDetails);
                navigate("/success-page"); // Replace with your success route
            }
        } catch (error) {
            console.error("Transaction failed:", error);
            toast.error("Transaction failed. Please try again");
        }
    };

    if (total === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-8">POS Sales</h1>
                <h2 className="text-2xl text-gray-500">No items in cart</h2>
            </div>
        );
    }

    if (total < 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-8">POS Sales</h1>
                <h2 className="text-2xl text-gray-500">Total cannot be negative</h2>
            </div>
        );
    }

    if (change < 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-8">POS Sales</h1>
                <h2 className="text-2xl text-gray-500">Amount received is less than total</h2>
            </div>
        );
    }

    if (change === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-8">POS Sales</h1>
                <h2 className="text-2xl text-gray-500">Amount received is equal to total</h2>
            </div>
        );
    }

    if (change < 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-8">POS Sales</h1>
                <h2 className="text-2xl text-gray-500">Amount received is less than total</h2>
            </div>
        );
    }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">POS Sales</h1>

      <div className="flex flex-col items-center justify-center">
        <CashRegister
          total={total}
          currency={currency}
          amountReceived={amountReceived}
          change={change}
          onAmountChange={handleAmountChange}
          onClear={handleClear}
          onDelete={handleDelete}
          onPaymentMethodChange={handlePaymentMethodChange}
        />
        <NumberPad
          amountReceived={amountReceived}
          onAmountChange={handleAmountChange}
          onPaymentMethodChange={handlePaymentMethodChange}
          onClear={handleClear}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default POSSales;
