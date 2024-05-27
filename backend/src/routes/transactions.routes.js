const { Router } = require('express');
const { isLoggedIn, isAuthenticated } = require('../middlewares/auth.middleware');
const { 
    getTransactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    searchTransactions 
} = require('../controllers/transactions.controller');

const router = Router();

router.get('/', isLoggedIn, isAuthenticated, getTransactions);
router.post('/', isLoggedIn, isAuthenticated, addTransaction);
router.put('/:id', isLoggedIn, isAuthenticated, updateTransaction);
router.delete('/:id', isLoggedIn, isAuthenticated, deleteTransaction);
router.get('/search', isLoggedIn, isAuthenticated, searchTransactions);

module.exports = router;