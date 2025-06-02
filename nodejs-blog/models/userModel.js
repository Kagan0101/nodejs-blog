const db = require('./db');
const bcrypt = require('bcryptjs');

// Kullanıcı oluşturma
exports.createUser = async (username, email, password, role = 'user') => {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
        INSERT INTO users (username, email, password, role, created_at, updated_at) 
        VALUES (?, ?, ?, ?, NOW(), NOW())
    `;
    
    const [result] = await db.query(query, [username, email, hashedPassword, role]);
    return result;
};

// Email ile kullanıcı bulma
exports.findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL';
    const [rows] = await db.query(query, [email]);
    
    return rows.length > 0 ? rows[0] : null;
};

// ID ile kullanıcı bulma
exports.findUserById = async (id) => {
    const query = 'SELECT id, username, email, role FROM users WHERE id = ? AND deleted_at IS NULL';
    const [rows] = await db.query(query, [id]);
    
    return rows.length > 0 ? rows[0] : null;
};

// Şifre doğrulama
exports.validatePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};