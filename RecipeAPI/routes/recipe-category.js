const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', async (req, res) => {
    try {
        const sql = `
      SELECT
        c.id as id,
        c.category_name as category_name,
        c.category_icon_path as category_icon_path,
    (SELECT COUNT(*) FROM recipes r WHERE r.category_id = c.id) as recipe_count
      FROM categories c 
      WHERE category_type = 'recipe' `;
        const [rows] = await db.query(sql);

        // ID'leri encode edip dönüyoruz
        const result = rows.map(category => ({...category}));

        const add_all = {
            id: 0,
            category_name: 'Tüm Tarifler',
            category_icon_path: 'all.png',
            recipe_count: rows.reduce((sum, category) => sum + category.recipe_count, 0)
        };
        result.unshift(add_all); // Tüm tarifler kategorisini başa ekliyoruz
        result.map(category => {
            category.id = encodeURIComponent(category.id); // ID'leri encode ediyoruz
            category.category_icon_path = '/images/categories/' + category.category_icon_path; // Kategori ikon URL'sini tam yapıyoruz
            return category;
        });
        res.json(result);
    } catch (error) {
        console.error('Error fetching recipe categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;