import React, { useEffect, useState } from "react";

const PrintReceiptPage = () => {
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    // Assume transaction details are passed in query params or window.opener
    const queryParams = new URLSearchParams(window.location.search);
    const transactionData = window.opener?.transactionDetails;

    if (transactionData) {
      setTransactionDetails(transactionData);
    } else {
      const details = {
        total: queryParams.get("total"),
        amountReceived: queryParams.get("amountReceived"),
        change: queryParams.get("change"),
        paymentMethod: queryParams.get("paymentMethod"),
      };
      setTransactionDetails(details);
    }
  }, []);

  if (!transactionDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="receipt">
      <h2>Receipt</h2>
      <p>Total: {transactionDetails.total}</p>
      <p>Amount Received: {transactionDetails.amountReceived}</p>
      <p>Change: {transactionDetails.change}</p>
      <p>Payment Method: {transactionDetails.paymentMethod}</p>
    </div>
  );
};

export default PrintReceiptPage;
