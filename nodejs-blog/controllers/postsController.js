const express = require('express');
const postModel = require('../models/postModels');

exports.PostPage = (req, res) => {
    // Admin kontrolü - sadece admin kullanıcılar post ekleyebilir
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).send('Bu sayfaya erişim yetkiniz yok');
    }
    res.render('post', { user: req.user });
};

exports.createPost = async (req, res) => {
    console.log('=== createPost function called ===');
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    console.log('User:', req.user);
    
    try {
        // Admin kontrolü
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).send('Post oluşturma yetkiniz yok');
        }
        
        const { title, slug, description, content, picture_url, category_id } = req.body;
        
        // Resim URL'ini belirle
        let finalImageUrl = picture_url || null;
        
        // Eğer dosya upload edilmişse, onun yolunu kullan
        if (req.file) {
            finalImageUrl = '/img/' + req.file.filename;
            console.log('File uploaded to:', finalImageUrl);
        }
        
        console.log('Final image URL:', finalImageUrl);
        
        // Validation
        if (!title || !slug || !description || !content || !category_id) {
            console.log('Validation failed - missing fields');
            return res.status(400).send('All required fields must be filled');
        }
        
        console.log('Validation passed, calling postModel.create...');
        
        // Post oluştur (user_id ekleyebilirsiniz)
        const result = await postModel.create(title, slug, description, content, finalImageUrl, category_id);
        
        console.log('Post created successfully! Result:', result);
        res.redirect('/posts?success=1');
        
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send('Error creating post: ' + error.message);
    }
};

exports.HomePage = async (req, res) => {
    try {
        const Posts = await postModel.getAllPosts();
        res.render('home', { 
            Posts, 
            user: req.user || null // Kullanıcı bilgisi template'e gönderilir
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).send('Server error');
    }
};

exports.ContentPage = async (req, res) => {
    try {
        console.log(req.params.slug);
        const Post = await postModel.getPostBySlug(req.params.slug);
        res.render('content', { 
            Post,
            user: req.user || null
        });
    } catch (error) {
        console.error('Error loading content page:', error);
        res.status(404).send('Post not found');
    }
};