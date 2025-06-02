const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// JWT token oluşturma
exports.generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, {
        expiresIn: '24h' // 24 saat geçerli
    });
};


exports.authenticateToken = (req, res, next) => {
    // Cookie'den token al
    const token = req.cookies.token;
    
    if (!token) {
        return res.redirect('/login?error=authentication_required');
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        res.clearCookie('token');
        return res.redirect('/login?error=invalid_token');
    }
};

// Admin kontrolü için 
exports.requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).send('Admin yetkisi gerekli');
    }
    next();
};

// Optional authentication - token varsa decode et, yoksa devam et
exports.optionalAuth = (req, res, next) => {
    const token = req.cookies.token;
    
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.user = decoded;
        } catch (error) {
            // Token geçersizse temizle ama devam et
            res.clearCookie('token');
        }
    }
    next();
};