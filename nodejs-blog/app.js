const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Routes
const postsRoutes = require('./config/postsRouter');
const authRoutes = require('./config/loginRouter');

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); 
app.use(express.static('public'));

// Routes
app.use('/posts', postsRoutes);
app.use('/', authRoutes);

// Ana sayfa yönlendirmesi
app.get('/', (req, res) => {
    res.redirect('/posts/home');
});

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));