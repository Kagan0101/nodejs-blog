const e = require('express');
const db = require('./db');

exports.getAllPosts = async () => {
    const [rows] = await db.query('SELECT * FROM posts WHERE deleted_at IS NULL ORDER BY created_at DESC');
    return rows;
};

exports.create = async (title, slug, description, content, picture_url, category_id) => {
    const query = `
        INSERT INTO posts (title, slug, description, content, picture_url, category_id, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const [result] = await db.query(query, [title, slug, description, content, picture_url, category_id]);
    return result;
};

exports.getPostBySlug = async (slug) => {
    const query = 'SELECT * FROM posts WHERE slug = ? AND deleted_at IS NULL';
    const [rows] = await db.query(query, [slug]);
    
    if (rows.length === 0) {
        throw new Error('Post not found');
    }
    
    return rows[0];
}