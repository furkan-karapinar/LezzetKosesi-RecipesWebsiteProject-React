const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', async (req, res) => {
    try {
        const sql = `
      SELECT c.id, c.category_name, c.category_icon_path,
(SELECT COUNT(*) FROM blogs b WHERE b.category_id = c.id) as 'category_count'
FROM categories c
WHERE c.category_type = 'blog'
GROUP BY c.id; `;

const total_sql = 'SELECT COUNT(*) as total FROM blogs;';
        const [rows] = await db.query(sql);
        const [totalRows] = await db.query(total_sql);
        const total = totalRows[0].total;

        // ID'leri encode edip dönüyoruz
        const result = rows.map(category => ({...category}));

        const add_all = {
            id: 0,
            category_name: 'Tümü',
            category_count: total,
            category_icon_path: '/all.png' // Tüm tarifler için özel ikon
        };
        result.unshift(add_all); // Tüm tarifler kategorisini başa ekliyoruz
        result.map(category => {
            category.id = encodeURIComponent(category.id); // ID'leri encode ediyoruz
            category.category_icon_path = '/images/categories/' + category.category_icon_path; // Kategori ikon URL'sini tam yapıyoruz
            return category;
        });
        res.json(result);
    } catch (error) {
        console.error('Error fetching blog categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;