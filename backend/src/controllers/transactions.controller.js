const { nanoid } = require("nanoid");
const { 
    addTransactionDB, 
    updateTransactionDB, 
    deleteTransactionDB, 
    getTransactionsDB, 
    searchTransactionsDB 
} = require("../services/transactions.service");

// Get all transactions
exports.getTransactions = async (req, res) => {
    try {
        const result = await getTransactionsDB();
        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(200).json([]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

// Add a new transaction
exports.addTransaction = async (req, res) => {
    try {
        const { total, amountReceived, paymentMethod } = req.body;

        if (!(total && amountReceived && paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Please provide required details: Total, Amount Received, Payment Method!"
            });
        }

        const uniqueCode = nanoid(10);
        const transactionId = await addTransactionDB(total, amountReceived, paymentMethod, uniqueCode);

        return res.status(200).json({
            success: true,
            message: "Transaction Added.",
            transactionId,
            uniqueCode
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const { total, amountReceived, paymentMethod } = req.body;

        await updateTransactionDB(transactionId, total, amountReceived, paymentMethod);

        return res.status(200).json({
            success: true,
            message: "Transaction Updated.",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        await deleteTransactionDB(transactionId);

        return res.status(200).json({
            success: true,
            message: "Transaction Deleted.",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

// Search for transactions
exports.searchTransactions = async (req, res) => {
    try {
        const searchString = req.query.q;

        if (!searchString) {
            return res.status(400).json({
                success: false,
                message: "Please provide required details!"
            });
        }

        const result = await searchTransactionsDB(searchString);

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                success: false,
                message: "No results found!"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};
