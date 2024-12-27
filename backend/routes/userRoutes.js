
const express = require('express');
const { registerUser, loginUser, getUserInfo } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware'); 
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/info', protect, getUserInfo);

module.exports = router;