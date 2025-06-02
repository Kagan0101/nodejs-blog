const userModel = require('../models/userModel');
const { generateToken } = require('../jwt/authjwt');

// Login sayfası
exports.LoginPage = (req, res) => {
    const error = req.query.error;
    const success = req.query.success;
    res.render('login', { error, success });
};

// Login işlemi
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.redirect('/login?error=missing_fields');
        }
        
        // Kullanıcıyı bul
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.redirect('/login?error=invalid_credentials');
        }
        
        // Şifre doğrulama
        const isPasswordValid = await userModel.validatePassword(password, user.password);
        if (!isPasswordValid) {
            return res.redirect('/login?error=invalid_credentials');
        }
        
        // JWT token oluştur
        const tokenPayload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        
        const token = generateToken(tokenPayload);
        
        // Cookie'ye token'ı kaydet
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS'de true
            maxAge: 24 * 60 * 60 * 1000 // 24 saat
        });
        
        console.log('User logged in successfully:', user.email);
        res.redirect('/posts/home');
        
    } catch (error) {
        console.error('Login error:', error);
        res.redirect('/login?error=server_error');
    }
};

// Register sayfası
exports.RegisterPage = (req, res) => {
    const error = req.query.error;
    res.render('register', { error });
};

// Register işlemi
exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        
        // Validation
        if (!username || !email || !password || !confirmPassword) {
            return res.redirect('/register?error=missing_fields');
        }
        
        if (password !== confirmPassword) {
            return res.redirect('/register?error=password_mismatch');
        }
        
        // Email kontrol et
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return res.redirect('/register?error=email_exists');
        }
        
        // Kullanıcı oluştur
        await userModel.createUser(username, email, password);
        
        console.log('New user registered:', email);
        res.redirect('/login?success=registration_successful');
        
    } catch (error) {
        console.error('Registration error:', error);
        res.redirect('/register?error=server_error');
    }
};

// Logout işlemi
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login?success=logged_out');
};

// Dashboard (sadece giriş yapmış kullanıcılar için)
exports.dashboard = (req, res) => {
    res.render('dashboard', { user: req.user });
};