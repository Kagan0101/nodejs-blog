const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const upload = require('../public/js/upload');
const { authenticateToken, requireAdmin, optionalAuth } = require('../jwt/authjwt');

// Public routes (herkes erişebilir)
router.get('/home', optionalAuth, postsController.HomePage);
router.get('/content/:slug', optionalAuth, postsController.ContentPage);

// Protected routes (sadece admin)
router.get('/', authenticateToken, requireAdmin, postsController.PostPage);
router.post('/addpost', authenticateToken, requireAdmin, upload.single('imageFile'), postsController.createPost);

module.exports = router;