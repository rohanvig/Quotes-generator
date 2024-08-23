const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');
const requireAuthorizedUser = require('../middleware/userMiddleware');
const {
  getAllQuotes,
  getRandomQuote,
  searchQuotes,
  addQuote,
  deleteQuote,
  getAdminQuotes,
  getAdminUsers,
  getaddquote
} = require('../controllers/quotesController');

// Public access routes
router.get('/getallquotes', getAllQuotes); // Public
router.get('/getRandomQuote', getRandomQuote); // Public
router.get('/search', searchQuotes); // Public

// Authenticated user routes
router.get('/addQuote',requireAuth,requireAuthorizedUser,getaddquote)
router.post('/addQuote', requireAuth, requireAuthorizedUser, addQuote); // Add quote logic
router.delete('/deleteQuote/:id', requireAuth, requireAuthorizedUser, deleteQuote); // Delete quote logic

// Admin routes
router.get('/admin/quotes', requireAuth, requireAdmin, getAdminQuotes); // Admin-only view all quotes
router.get('/admin/users', requireAuth, requireAdmin, getAdminUsers); // Admin-only view all users

module.exports = router;
