const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public routes
router.get('/login', authController.LoginPage);
router.post('/login', authController.login);
router.get('/register', authController.RegisterPage);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

module.exports = router;