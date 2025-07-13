require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const { decodeId, encodeId } = require('../utils');
const authMiddleware = require('../middlewares/authMiddleware');

const default_limit = 12;

// Token üretme
function generateToken(user) {
    return jwt.sign(
        { user_id: user.id, email: user.email },
        process.env.JWT_SECRET
    );
}

// GET: Tüm tarifler (opsiyonel arama)
router.get('/', async (req, res) => {
    const search = req.query.s;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || default_limit;
    try {
        let sql = `
   SELECT
    u.id,
    u.username,
    u.email,
    u.fullname,
    u.avatar,
    u.city,
    u.country,
    u.gender,
    u.about,
    u.created_at,
    u.updated_at,
    u.is_deleted,

    -- Bu kullanıcının tarif sayısı
    (SELECT COUNT(r.id) FROM recipes r WHERE r.user_id = u.id) AS recipe_count,

    -- Bu kullanıcının blog yazısı sayısı
    (SELECT COUNT(b.id) FROM blogs b WHERE b.user_id = u.id) AS blog_count,

    -- Bu kullanıcının tariflerine gelen toplam beğeni sayısı
    (
        SELECT COUNT(*) 
        FROM recipes r 
        LEFT JOIN likes l ON l.is_recipe = 1 AND l.recipe_or_blog_id = r.id
        WHERE r.user_id = u.id
    ) AS like_count,

    -- Bu kullanıcının tariflerine gelen toplam görüntülenme sayısı
    (
        SELECT COUNT(*) 
        FROM recipes r 
        LEFT JOIN views v ON v.is_recipe = 1 AND v.recipe_or_blog_id = r.id
        WHERE r.user_id = u.id
    ) AS view_count

FROM users u
WHERE 1=1

      `;

        let page_info_sql = `SELECT COUNT(DISTINCT u.id) AS total
  FROM users u
  WHERE 1=1 `;


        let params = [];
        let countParams = [];

        if (search) {
            const keyword = '%' + decodeURIComponent(search) + '%';
            sql += ' AND ( u.username LIKE ? OR u.email LIKE ? ) ';
            page_info_sql += ' AND (u.username LIKE ? OR u.email LIKE ? ) ';
            params = [keyword, keyword];
            countParams = [keyword, keyword];
        }



        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, (page - 1) * limit);


        const [rows] = await db.query(sql, params);

        const [[countResult]] = await db.query(page_info_sql, countParams);
        const totalItems = countResult.total;
        const totalPages = Math.ceil(totalItems / limit);


        // ID'leri encode edip dönüyoruz
        const result = rows.map(user => ({
            ...user,
            id: encodeId(user.id),
            avatar: '/images/avatars/' + user.avatar, // avatar URL'si varsa string olarak döndürüyoruz
            created_at: new Date(user.created_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
            updated_at: new Date(user.updated_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
        }));

        res.json({
            status: 'success',
            users: result,
            pagination: {
                currentPage: page,
                limit: limit,
                totalItems: totalItems,
                totalPages: totalPages
            }
        });


        // res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 📌 LOGIN: kullanıcı giriş
router.post('/user/login', (req, res) => {
    const { email, password } = req.body;
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    const resultt = async () => {
        const rows = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.err) return res.status(500).json({ error: 'Veritabanı hatası' });
        if (rows.length === 0) return res.status(401).json({ error: 'Kullanıcı bulunamadı' });

        const user = rows[0][0];
        const passwordMatch = await bcrypt.compare(password, user.passwd);
        if (!passwordMatch) return res.status(401).json({ error: 'Şifre hatalı' });

        const token = generateToken(user);

        const rows2 = await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

        if (rows2.err) return res.status(500).json({ error: 'Token kaydedilemedi' });
        return res.json({ status: 'success', token: token });

    }
    return resultt();
});

// 🔒 LOGOUT: token temizleme
router.post('/user/logout', authMiddleware, async (req, res) => {
    const userId = req.user.id;
 console.log('Kullanıcı ID:', userId);
    const result = await db.query('UPDATE users SET token = "" WHERE id = ?', [userId]);
    if (!result.err) {
        console.log('Çıkış başarılı, token temizlendi');
        res.json({ status: 'success' });
    } else {
        console.error('Çıkış başarısız, token temizlenemedi');
        res.json({ error: 'Çıkış yapılamadı' });
    }
});
// 👤 /me: giriş yapmış kullanıcıyı getir
router.get('/user/me', authMiddleware, async (req, res) => {
    try
    {
        const userId = req.user.id;
    const [rows] = await db.query('SELECT id, username, email, phone, address, city, country, avatar, fullname, gender, about, badge_level_id, created_at, updated_at, is_deleted FROM users WHERE id = ?', [userId]);
    if (rows.err) return res.json({ error: 'Veritabanı hatası' });
    if (rows.length === 0) return res.json({ error: 'Kullanıcı bulunamadı' });
    res.json(rows[0]);
    }
    catch (err) {
        console.error('Hata:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});




router.post('/user/register', async (req, res) => {
    try {
        const {
            username, email, phone, address, city,
            country, fullname, gender, about, passwd
        } = req.body;

        const hashedPassword = await bcrypt.hash(passwd, 10);
        const params = [username, email, phone, address, city, country, fullname, gender, about, hashedPassword, 1, ''];
        const [rows] = await db.query("INSERT INTO `users` (`username`, `email`, `phone`, `address`, `city`, `country`, `fullname`, `gender`, `about`, `passwd`,`badge_level_id`, `token`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [...params, '']);
        console.log('Sonuç (Hata vs.):', rows);
        const id = rows.insertId;


        if (id > 0) {
            return res.json({ status: 'success' });
        }
        else {
            return res.json({ status: 'error' });
        }
    }
    catch {
        return res.json({ status: 'error' });
    }

});

// POST: Kullanıcı şifre unuttum
router.post('/user/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ error: 'Email alanı zorunludur' });
        }
        // Burada şifre sıfırlama işlemi yapılabilir, örneğin bir token oluşturup email göndermek gibi
        // Ancak bu örnekte basit bir yanıt döndürüyoruz
        res.json({ status: 'success', message: 'Şifre sıfırlama talebi alındı. Lütfen emailinizi kontrol edin.' });
    } catch (err) {
        res.json({ error: err.message });
    }
});

// GET: Tek tarif (şifrelenmiş ID ile)
router.get('/:id', async (req, res) => {
    const id = decodeId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Geçersiz ID' });

    try {
        const [rows] = await db.query(`
       SELECT
    u.id,
    u.username,
    u.email,
    u.fullname,
    u.avatar,
    u.city,
    u.country,
    u.gender,
    u.about,
    u.created_at,
    u.updated_at,
    u.is_deleted,

    -- Bu kullanıcının tarif sayısı
    (SELECT COUNT(r.id) FROM recipes r WHERE r.user_id = u.id) AS recipe_count,

    -- Bu kullanıcının blog yazısı sayısı
    (SELECT COUNT(b.id) FROM blogs b WHERE b.user_id = u.id) AS blog_count,

    -- Bu kullanıcının tariflerine gelen toplam beğeni sayısı
    (
        SELECT COUNT(*) 
        FROM recipes r 
        LEFT JOIN likes l ON l.is_recipe = 1 AND l.recipe_or_blog_id = r.id
        WHERE r.user_id = u.id
    ) AS like_count,

    -- Bu kullanıcının tariflerine gelen toplam görüntülenme sayısı
    (
        SELECT COUNT(*) 
        FROM recipes r 
        LEFT JOIN views v ON v.is_recipe = 1 AND v.recipe_or_blog_id = r.id
        WHERE r.user_id = u.id
    ) AS view_count,

    (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'badge_id', bg.id,
            'badge_name', bg.badge_name,
            'badge_icon', bg.badge_icon_url,
            'badge_color', bg.badge_color
        )) FROM badges bg
        WHERE u.badge_level_id = bg.id
    ) AS badges

FROM users u WHERE id = ?
    `, [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

        const result = rows.map(recipe => ({
            ...recipe,
            id: encodeId(recipe.id),
            avatar: '/images/avatars/' + recipe.avatar, // avatar URL'si varsa string olarak döndürüyoruz
            created_at: new Date(recipe.created_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
            updated_at: new Date(recipe.updated_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
            badges: JSON.parse(recipe.badges || '[]').map(badge => ({
                badge_id: encodeId(badge.badge_id),
                badge_name: badge.badge_name,
                badge_icon: '/images/badges/' + badge.badge_icon,
                badge_color: badge.badge_color || '000000' // badge_color yoksa varsayılan renk
            })) // JSON.parse ile yorumları diziye çevirip ID'leri encode ediyoruz
        }));


        const user = result[0];
        user.id = encodeId(user.id); // ID encode'lu döndürülüyor
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/mainuser/:id', async (req, res) => {
    const id = decodeId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Geçersiz ID' });

    try {
        const [rows] = await db.query(`
       SELECT
    u.*,

    -- Bu kullanıcının tarif sayısı
    (SELECT COUNT(r.id) FROM recipes r WHERE r.user_id = u.id) AS recipe_count,

    -- Bu kullanıcının blog yazısı sayısı
    (SELECT COUNT(b.id) FROM blogs b WHERE b.user_id = u.id) AS blog_count,

    -- Bu kullanıcının tariflerine gelen toplam beğeni sayısı
    (
        SELECT COUNT(*) 
        FROM recipes r 
        LEFT JOIN likes l ON l.is_recipe = 1 AND l.recipe_or_blog_id = r.id
        WHERE r.user_id = u.id
    ) AS like_count,

    -- Bu kullanıcının tariflerine gelen toplam görüntülenme sayısı
    (
        SELECT COUNT(*) 
        FROM recipes r 
        LEFT JOIN views v ON v.is_recipe = 1 AND v.recipe_or_blog_id = r.id
        WHERE r.user_id = u.id
    ) AS view_count,

    (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'badge_id', bg.id,
            'badge_name', bg.badge_name,
            'badge_icon', bg.badge_icon_url,
            'badge_color', bg.badge_color
        )) FROM badges bg
        WHERE u.badge_level_id = bg.id
    ) AS badges

FROM users u WHERE id = ?
    `, [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

        const result = rows.map(recipe => ({
            ...recipe,
            id: encodeId(recipe.id),
            avatar: '/images/avatars/' + recipe.avatar, // avatar URL'si varsa string olarak döndürüyoruz
            created_at: new Date(recipe.created_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
            updated_at: new Date(recipe.updated_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
            badges: JSON.parse(recipe.badges || '[]').map(badge => ({
                badge_id: encodeId(badge.badge_id),
                badge_name: badge.badge_name,
                badge_icon: '/images/badges/' + badge.badge_icon,
                badge_color: badge.badge_color || '000000' // badge_color yoksa varsayılan renk
            })) // JSON.parse ile yorumları diziye çevirip ID'leri encode ediyoruz
        }));


        const user = result[0];
        user.id = encodeId(user.id); // ID encode'lu döndürülüyor
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/username/:username', async (req, res) => {
    const username = decodeId(req.params.username);
    if (!username) return res.status(400).json({ error: 'Geçersiz Kullanıcı Adı' });

    try {
        const [rows] = await db.query(`
       SELECT
    u.id,
    u.username,
    u.email,
    u.fullname,
    u.avatar,
    u.city,
    u.country,
    u.gender,
    u.about,
    u.created_at,
    u.updated_at,
    u.is_deleted,

    -- Bu kullanıcının tarif sayısı
    (SELECT COUNT(r.id) FROM recipes r WHERE r.user_id = u.id) AS recipe_count,

    -- Bu kullanıcının blog yazısı sayısı
    (SELECT COUNT(b.id) FROM blogs b WHERE b.user_id = u.id) AS blog_count,

    -- Bu kullanıcının tariflerine gelen toplam beğeni sayısı
    (
        SELECT COUNT(*) 
        FROM recipes r 
        LEFT JOIN likes l ON l.is_recipe = 1 AND l.recipe_or_blog_id = r.id
        WHERE r.user_id = u.id
    ) AS like_count,

    -- Bu kullanıcının tariflerine gelen toplam görüntülenme sayısı
    (
        SELECT COUNT(*) 
        FROM recipes r 
        LEFT JOIN views v ON v.is_recipe = 1 AND v.recipe_or_blog_id = r.id
        WHERE r.user_id = u.id
    ) AS view_count,

    (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'badge_id', bg.id,
            'badge_name', bg.badge_name,
            'badge_icon', bg.badge_icon_url,
            'badge_color', bg.badge_color
        )) FROM badges bg
        WHERE u.badge_level_id = bg.id
    ) AS badges

FROM users u WHERE username = ?
    `, [username]);

        if (rows.length === 0) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

        const result = rows.map(recipe => ({
            ...recipe,
            id: encodeId(recipe.id),
            avatar: '/images/avatars/' + recipe.avatar, // avatar URL'si varsa string olarak döndürüyoruz
            created_at: new Date(recipe.created_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
            updated_at: new Date(recipe.updated_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
            badges: JSON.parse(recipe.badges || '[]').map(badge => ({
                badge_id: encodeId(badge.badge_id),
                badge_name: badge.badge_name,
                badge_icon: '/images/badges/' + badge.badge_icon,
                badge_color: badge.badge_color || '000000' // badge_color yoksa varsayılan renk
            })) // JSON.parse ile yorumları diziye çevirip ID'leri encode ediyoruz
        }));


        const user = result[0];
        user.id = encodeId(user.id); // ID encode'lu döndürülüyor
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Kullanıcının tarifleri (şifrelenmiş ID ile)
router.get('/:id/recipes', async (req, res) => {
    const id = decodeId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Geçersiz ID' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || default_limit;
    const offset = parseInt(req.query.offset) || (page - 1) * limit;
    let params = [];

    let page_info_sql = `SELECT COUNT(DISTINCT r.id) AS total
    FROM recipes r
    WHERE r.user_id = ? `;

    try {

        params.push(id, limit, offset);

        const [rows] = await db.query(`
        SELECT r.* , c.category_name FROM recipes r LEFT JOIN users u ON r.user_id = u.id LEFT JOIN categories c ON r.category_id = c.id WHERE u.id = ?  LIMIT ? OFFSET ?
      `, params);

        if (rows.length === 0) return res.status(404).json({ error: 'Kullanıcı Tarifleri bulunamadı' });

        const result = rows.map(recipe => ({
            ...recipe,
            id: encodeId(recipe.id),
            image: recipe.image ? '/images/recipes/' + recipe.image : null, // image varsa URL'si döndürülüyor
            created_at: new Date(recipe.created_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
            updated_at: new Date(recipe.updated_at).toLocaleString('tr-TR', { dateStyle: 'full' }),

        }));

        const [[countResult]] = await db.query(page_info_sql, [id]);
        const totalItems = countResult.total;
        const totalPages = Math.ceil(totalItems / limit);


        res.json({
            status: 'success',
            users: result,
            pagination: {
                currentPage: page,
                limit: limit,
                totalItems: totalItems,
                totalPages: totalPages
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Kullanıcının blogları (şifrelenmiş ID ile)
router.get('/:id/blogs', async (req, res) => {
    const id = decodeId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Geçersiz ID' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || default_limit;
    let params = [];

    let page_info_sql = `SELECT COUNT(DISTINCT r.id) AS total
    FROM blogs r
    WHERE r.user_id = ? `;

    try {

        params.push(id, limit, (page - 1) * limit);

        const [rows] = await db.query(`
        SELECT b.* , c.category_name, c.category_icon_path 

    FROM blogs b LEFT JOIN users u ON b.user_id = u.id LEFT JOIN categories c ON b.category_id = c.id WHERE u.id = ?  LIMIT ? OFFSET ?
      `, params);

        if (rows.length === 0) return res.status(404).json({ error: 'Kullanıcı Tarifleri bulunamadı' });

        const result = rows.map(recipe => ({
            ...recipe,
            id: encodeId(recipe.id),
            image: recipe.image ? '/images/blogs/' + recipe.image : null, // image URL'si varsa string olarak döndürüyoruz
            created_at: new Date(recipe.created_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
            updated_at: new Date(recipe.updated_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
            category_id: encodeId(recipe.category_id)

        }));

        const [[countResult]] = await db.query(page_info_sql, [id]);
        const totalItems = countResult.total;
        const totalPages = Math.ceil(totalItems / limit);

        res.json({
            status: 'success',
            users: result,
            pagination: {
                currentPage: page,
                limit: limit,
                totalItems: totalItems,
                totalPages: totalPages
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/recipes/likes', async (req, res) => {

    const userId = decodeId(req.params.id);
    if (!userId) return res.status(400).json({ error: 'Geçersiz kullanıcı ID' });

    try {
        const [rows] = await db.query(`
        SELECT r.id FROM recipes r
        JOIN likes l ON r.id = l.recipe_or_blog_id
        JOIN users u ON r.user_id = u.id
        WHERE l.user_id = ? AND l.is_recipe = 1
      `, [userId]);

        if (rows.length === 0) return res.status(404).json({ error: 'Beğenilen tarif bulunamadı' });

        const result = rows.map(recipe => ({
            ...recipe,
            id: encodeId(recipe.id),
        }));

        res.json({
            status: 'success',
            likes: result,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

router.get('/:id/recipes/bookmarks', async (req, res) => {

    const userId = decodeId(req.params.id);
    if (!userId) return res.status(400).json({ error: 'Geçersiz kullanıcı ID' });

    try {
        const [rows] = await db.query(`
        SELECT r.id FROM recipes r
        JOIN bookmarks b ON r.id = b.recipe_or_blog_id
        JOIN users u ON r.user_id = u.id
        WHERE b.user_id = ? AND b.is_recipe = 1
      `, [userId]);

        if (rows.length === 0) return res.status(404).json({ error: 'Kaydedilmiş tarif bulunamadı' });

        const result = rows.map(recipe => ({
            ...recipe,
            id: encodeId(recipe.id),
        }));

        res.json({
            status: 'success',
            bookmarks: result,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

// GET: Tarif beğenme durumu kontrolü (şifrelenmiş ID ile) -- Tarif beğenilmiş ise beğeniyi kaldırır, beğenilmemiş ise beğeni ekler
router.get('/:id/recipes/likes/check/:recipeId', async (req, res) => {
    const userId = decodeId(req.params.id);
    const recipeId = decodeId(req.params.recipeId);
    if (!userId || !recipeId) return res.status(400).json({ error: 'Geçersiz kullanıcı veya tarif ID' });


    let status = "added";

    try {
        const [rows] = await db.query(`
        SELECT l.id FROM likes l WHERE user_id = ? AND recipe_or_blog_id = ? AND is_recipe = 1;
        `, [userId, recipeId]);

        const likeCount = rows[0]?.id;

        if (likeCount > 0) {

            // Eğer beğeni varsa, beğeniyi kaldırıyoruz
            await db.query(`
                DELETE FROM likes WHERE id = ?;
            `, [likeCount]);

            status = "deleted";
        }
        else {
            // Eğer beğeni yoksa, yeni bir beğeni ekliyoruz
            await db.query(`
                INSERT INTO likes (user_id, recipe_or_blog_id, is_recipe) VALUES (?, ?, 1);
            `, [userId, recipeId]);
            status = "added";
        }


        res.json({
            status: 'success',
            like_status: status
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Tarif beğenilmiş mi kontrolü (şifrelenmiş ID ile)
router.get('/:id/recipes/likes/check/:recipeId/status', async (req, res) => {
    const userId = decodeId(req.params.id);
    const recipeId = decodeId(req.params.recipeId);
    if (!userId || !recipeId) return res.status(400).json({ error: 'Geçersiz kullanıcı veya tarif ID' });
    try {
        const [rows] = await db.query(`
        SELECT COUNT(*) AS like_count FROM likes WHERE user_id = ? AND recipe_or_blog_id = ? AND is_recipe = 1;
        `, [userId, recipeId]);
        const likeCount = rows[0]?.like_count || 0;
        res.json({
            status: 'success',
            liked: likeCount > 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// GET: Tarif kaydetme durumu kontrolü (şifrelenmiş ID ile) -- Tarif kaydedilmiş ise kaydı kaldırır, kaydedilmemiş ise kaydeder
router.get('/:id/recipes/bookmarks/check/:recipeId', async (req, res) => {
    const userId = decodeId(req.params.id);
    const recipeId = decodeId(req.params.recipeId);
    if (!userId || !recipeId) return res.status(400).json({ error: 'Geçersiz kullanıcı veya tarif ID' });

    let status = "added";

    try {
        const [rows] = await db.query(`
        SELECT b.id FROM bookmarks b WHERE user_id = ? AND recipe_or_blog_id = ? AND is_recipe = 1;
        `, [userId, recipeId]);

        const bookmarkCount = rows[0]?.id;

        if (bookmarkCount > 0) {
            // Eğer kayıt varsa, kaydı kaldırıyoruz
            await db.query(`
                DELETE FROM bookmarks WHERE id = ?;
            `, [bookmarkCount]);

            status = "deleted";
        } else {
            // Eğer kayıt yoksa, yeni bir kayıt ekliyoruz
            await db.query(`
                INSERT INTO bookmarks (user_id, recipe_or_blog_id, is_recipe) VALUES (?, ?, 1);
            `, [userId, recipeId]);
            status = "added";
        }

        res.json({
            status: 'success',
            bookmark_status: status
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Tarif kaydedilmiş mi kontrolü (şifrelenmiş ID ile)
router.get('/:id/recipes/bookmarks/check/:recipeId/status', async (req, res) => {
    const userId = decodeId(req.params.id);
    const recipeId = decodeId(req.params.recipeId);
    if (!userId || !recipeId) return res.status(400).json({ error: 'Geçersiz kullanıcı veya tarif ID' });
    try {
        const [rows] = await db.query(`
        SELECT COUNT(*) AS bookmark_count FROM bookmarks WHERE user_id = ? AND recipe_or_blog_id = ? AND is_recipe = 1;
        `, [userId, recipeId]);
        const bookmarkCount = rows[0]?.bookmark_count || 0;
        res.json({
            status: 'success',
            bookmarked: bookmarkCount > 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/blogs/likes', async (req, res) => {

    const userId = decodeId(req.params.id);
    if (!userId) return res.status(400).json({ error: 'Geçersiz kullanıcı ID' });

    try {
        const [rows] = await db.query(`
        SELECT b.id FROM blogs b
        JOIN likes l ON b.id = l.recipe_or_blog_id
        JOIN users u ON b.user_id = u.id
        WHERE l.user_id = ? AND l.is_recipe = 0
      `, [userId]);

        if (rows.length === 0) return res.status(404).json({ error: 'Beğenilen blog bulunamadı' });

        const result = rows.map(blog => ({
            ...blog,
            id: encodeId(blog.id)
        }));

        res.json({
            status: 'success',
            likes: result,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

router.get('/:id/blogs/bookmarks', async (req, res) => {

    const userId = decodeId(req.params.id);
    if (!userId) return res.status(400).json({ error: 'Geçersiz kullanıcı ID' });

    try {
        const [rows] = await db.query(`
        SELECT b.id FROM blogs b
        JOIN bookmarks bm ON b.id = bm.recipe_or_blog_id
        JOIN users u ON b.user_id = u.id
        WHERE bm.user_id = ? AND bm.is_recipe = 0
      `, [userId]);

        if (rows.length === 0) return res.status(404).json({ error: 'Kaydedilmiş blog bulunamadı' });

        const result = rows.map(blog => ({
            ...blog,
            id: encodeId(blog.id)
        }));

        res.json({
            status: 'success',
            bookmarks: result,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

// GET: Blog beğenme durumu kontrolü (şifrelenmiş ID ile) -- Blog beğenilmiş ise beğeniyi kaldırır, beğenilmemiş ise beğeni ekler
router.get('/:id/blogs/likes/check/:blogId', async (req, res) => {
    const userId = decodeId(req.params.id);
    const blogId = decodeId(req.params.blogId);
    if (!userId || !blogId) return res.status(400).json({ error: 'Geçersiz kullanıcı veya blog ID' });

    let status = "added";

    try {
        const [rows] = await db.query(`
        SELECT l.id FROM likes l WHERE user_id = ? AND recipe_or_blog_id = ? AND is_recipe = 0;
        `, [userId, blogId]);

        const likeCount = rows[0]?.id;

        if (likeCount > 0) {
            // Eğer beğeni varsa, beğeniyi kaldırıyoruz
            await db.query(`
                DELETE FROM likes WHERE id = ?;
            `, [likeCount]);

            status = "deleted";
        } else {
            // Eğer beğeni yoksa, yeni bir beğeni ekliyoruz
            await db.query(`
                INSERT INTO likes (user_id, recipe_or_blog_id, is_recipe) VALUES (?, ?, 0);
            `, [userId, blogId]);
            status = "added";
        }

        res.json({
            status: 'success',
            like_status: status
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Blog beğenilmiş mi kontrolü (şifrelenmiş ID ile)
router.get('/:id/blogs/likes/check/:blogId/status', async (req, res) => {
    const userId = decodeId(req.params.id);
    const blogId = decodeId(req.params.blogId);
    if (!userId || !blogId) return res.status(400).json({ error: 'Geçersiz kullanıcı veya blog ID' });
    try {
        const [rows] = await db.query(`
        SELECT COUNT(*) AS like_count FROM likes WHERE user_id = ? AND recipe_or_blog_id = ? AND is_recipe = 0;
        `, [userId, blogId]);
        const likeCount = rows[0]?.like_count || 0;
        res.json({
            status: 'success',
            liked: likeCount > 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Blog kaydetme durumu kontrolü (şifrelenmiş ID ile) -- Blog kaydedilmiş ise kaydı kaldırır, kaydedilmemiş ise kaydeder
router.get('/:id/blogs/bookmarks/check/:blogId', async (req, res) => {
    const userId = decodeId(req.params.id);
    const blogId = decodeId(req.params.blogId);
    if (!userId || !blogId) return res.status(400).json({ error: 'Geçersiz kullanıcı veya blog ID' });

    let status = "added";

    try {
        const [rows] = await db.query(`
        SELECT bm.id FROM bookmarks bm WHERE user_id = ? AND recipe_or_blog_id = ? AND is_recipe = 0;
        `, [userId, blogId]);

        const bookmarkCount = rows[0]?.id;

        if (bookmarkCount > 0) {
            // Eğer kayıt varsa, kaydı kaldırıyoruz
            await db.query(`
                DELETE FROM bookmarks WHERE id = ?;
            `, [bookmarkCount]);

            status = "deleted";
        } else {
            // Eğer kayıt yoksa, yeni bir kayıt ekliyoruz
            await db.query(`
                INSERT INTO bookmarks (user_id, recipe_or_blog_id, is_recipe) VALUES (?, ?, 0);
            `, [userId, blogId]);
            status = "added";
        }

        res.json({
            status: 'success',
            bookmark_status: status
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Blog kaydedilmiş mi kontrolü (şifrelenmiş ID ile)
router.get('/:id/blogs/bookmarks/check/:blogId/status', async (req, res) => {
    const userId = decodeId(req.params.id);
    const blogId = decodeId(req.params.blogId);
    if (!userId || !blogId) return res.status(400).json({ error: 'Geçersiz kullanıcı veya blog ID' });
    try {
        const [rows] = await db.query(`
        SELECT COUNT(*) AS bookmark_count FROM bookmarks WHERE user_id = ? AND recipe_or_blog_id = ? AND is_recipe = 0;
        `, [userId, blogId]);
        const bookmarkCount = rows[0]?.bookmark_count || 0;
        res.json({
            status: 'success',
            bookmarked: bookmarkCount > 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Kaydedilmiş tarifler (şifrelenmiş ID ile)
router.get('/:id/bookmarks/recipes', async (req, res) => {
    const userId = decodeId(req.params.id);

    if (!userId) return res.status(400).json({ error: 'Geçersiz kullanıcı ID' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || default_limit;

    const search = req.query.search;
    const sort = req.query.sort;
    const category = req.query.category;
    const difficulty = req.query.difficulty;
    const time = req.query.time;

    try {

        let query = `SELECT r.* , u.fullname AS author_fullname,
    u.username AS author_username,
    u.avatar AS author_avatar FROM recipes r
        JOIN bookmarks sr ON r.id = sr.recipe_or_blog_id
        JOIN users u ON r.user_id = u.id 
        WHERE sr.user_id = ? AND sr.is_recipe = 1 `;

        let params = [userId];
        let page_info_params = [userId];
        let filter = ``;

        if (search && search.trim() !== '') {
            filter += ` AND (r.title LIKE ? OR r.description LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
            page_info_params.push(`%${search}%`, `%${search}%`);
        }

        if (category && category !== '0') {
            filter += ` AND r.category_id = ?`;
            params.push(category);
            page_info_params.push(category);
        }

        if (difficulty && difficulty !== 'all') {

            filter += ` AND r.difficulty = ?`;
            params.push(difficulty);
            page_info_params.push(difficulty);

        }

        if (time && time !== 'all') {
            if (time === 'quick') {
                filter += ` AND r.reading_time <= 30`; // 30 ve 30 dakikadan kısa tarifler
            } else if (time === 'medium') {
                filter += ` AND r.reading_time BETWEEN 30 AND 60`; // 30-60 dakika arası tarifler
            } else if (time === 'long') {
                filter += ` AND r.reading_time > 60`; // 60 dakikadan uzun tarifler
            }
        }

        if (sort && sort !== '') {

            if (sort === 'rating') {
                filter += ` ORDER BY r.average_rating DESC`;
            }
            else if (sort === 'rrating') {
                filter += ` ORDER BY r.average_rating ASC`;
            }
            else if (sort === 'newest') {
                filter += ` ORDER BY r.created_at DESC`;
            }
            else if (sort === 'oldest') {
                filter += ` ORDER BY r.created_at ASC`;
            }
            else if (sort === 'time') {
                filter += ` ORDER BY r.reading_time DESC`;
            }
            else if (sort === 'rtime') {
                filter += ` ORDER BY r.reading_time ASC`;
            }
            else { // popular - default
                filter += ` ORDER BY r.view_count DESC`;
            }

        }
        params.push(limit, (page - 1) * limit);
        query += filter;
        query += ` LIMIT ? OFFSET ?`;


        let page_info_sql = `SELECT COUNT(DISTINCT r.id) AS total
        FROM recipes r
        JOIN bookmarks sr ON r.id = sr.recipe_or_blog_id
        WHERE sr.user_id = ? AND sr.is_recipe = 1 `;

        page_info_sql += filter;
        const [rows] = await db.query(query, params);

        if (rows.length === 0) return res.json(
            {
                status: 'error',
                recipes: [],
                pagination: {
                    currentPage: 0,
                    limit: 0,
                    totalItems: 0,
                    totalPages: 0
                }
            }
        );

        const result = rows.map(recipe => ({
            ...recipe,
            id: encodeId(recipe.id),
            image: recipe.image ? '/images/recipes/' + recipe.image : null, // image varsa URL'si döndürülüyor
            author_avatar: '/images/avatars/' + recipe.author_avatar, // avatar URL'si varsa string olarak döndürüyoruz
            created_at: new Date(recipe.created_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
            updated_at: new Date(recipe.updated_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
        }));

        const [[countResult]] = await db.query(page_info_sql, page_info_params);
        const totalItems = countResult.total;
        const totalPages = Math.ceil(totalItems / limit);

        res.json({
            status: 'success',
            recipes: result,
            pagination: {
                currentPage: page,
                limit: limit,
                totalItems: totalItems,
                totalPages: totalPages
            }
        });
    } catch (err) {
        res.json({
            status: 'error',
            recipes: [],
            pagination: {
                currentPage: 0,
                limit: 0,
                totalItems: 0,
                totalPages: 0
            }
        });
    }
});

// GET: Kaydedilmiş bloglar (şifrelenmiş ID ile)
router.get('/:id/bookmarks/blogs', async (req, res) => {
    const userId = decodeId(req.params.id);
    if (!userId) return res.status(400).json({ error: 'Geçersiz kullanıcı ID' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || default_limit;

    const search = req.query.search;
    const sort = req.query.sort;
    const time = req.query.time;
    const category = req.query.category;

    let query = `SELECT r.* , c.category_name AS category_name, u.fullname AS author_fullname,
    u.username AS author_username,
    u.avatar AS author_avatar FROM blogs r
        JOIN bookmarks sr ON r.id = sr.recipe_or_blog_id
        JOIN users u ON r.user_id = u.id
        JOIN categories c ON r.category_id = c.id
        WHERE sr.user_id = ? AND sr.is_recipe = 0 `;

    let params = [userId];
    let filter = ``;

    if (search && search.trim() !== '') {
        filter += ` AND (r.title LIKE ? OR r.description LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    if (category && category !== '0') {
        filter += ` AND r.category_id = ?`;
        params.push(category);
    }

    if (time && time !== 'all') {
        if (time === 'quick') {
            filter += ` AND r.reading_time <= 30`; // 30 ve 30 dakikadan kısa tarifler
        } else if (time === 'medium') {
            filter += ` AND r.reading_time BETWEEN 30 AND 60`; // 30-60 dakika arası tarifler
        } else if (time === 'long') {
            filter += ` AND r.reading_time > 60`; // 60 dakikadan uzun tarifler
        }
    }

    if (sort && sort !== '') {

        if (sort === 'oldest') {
            filter += ` ORDER BY r.created_at ASC`;
        }
        else if (sort === 'time') {
            filter += ` ORDER BY r.reading_time DESC`;
        }
        else if (sort === 'rtime') {
            filter += ` ORDER BY r.reading_time ASC`;
        }
        else { // popular - newest
            filter += ` ORDER BY r.created_at DESC`;
        }

    }
    params.push(limit, (page - 1) * limit);
    query += filter;
    query += ` LIMIT ? OFFSET ?`;

    try {
        const [rows] = await db.query(query, params);

        if (rows.length === 0) return res.json({
            status: 'error',
            recipes: [],
            pagination: {
                currentPage: 0,
                limit: 0,
                totalItems: 0,
                totalPages: 0
            }
        });

        const result = rows.map(recipe => ({
            ...recipe,
            id: encodeId(recipe.id),
            image: recipe.image ? '/images/blogs/' + recipe.image : null, // image varsa URL'si döndürülüyor
            author_avatar: '/images/avatars/' + recipe.author_avatar, // avatar URL'si varsa string olarak döndürüyoruz
            created_at: new Date(recipe.created_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
            updated_at: new Date(recipe.updated_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
        }));

        res.json({
            status: 'success',
            recipes: result,
            pagination: {
                currentPage: page,
                limit: limit,
                totalItems: rows.length,
                totalPages: Math.ceil(rows.length / limit)
            }
        });
    } catch (err) {
        res.json({
            status: 'error',
            recipes: [],
            pagination: {
                currentPage: 0,
                limit: 0,
                totalItems: 0,
                totalPages: 0
            }
        });
    }
});


// DELETE: Kullanıcı tarif silme (şifrelenmiş ID ile)
router.delete('/:id/recipes/:recipeId', async (req, res) => {
    const userId = decodeId(req.params.id);
    const recipeId = decodeId(req.params.recipeId);
    if (!userId || !recipeId) return res.status(400).json({ error: 'Geçersiz kullanıcı veya tarif ID' });
    try {
        // Önce tarifin veritabanında varlığını kontrol et
        const [rows] = await db.query('SELECT * FROM recipes WHERE id = ? AND user_id = ?', [recipeId, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Tarif bulunamadı veya bu tarif sizin değil' });
        }
        // Tarifin resim dosyasını sil
        if (rows[0].image) {
            const imagePath = path.join(__dirname, '..', 'public', 'images', 'recipes', rows[0].image);
            fs.access(imagePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.unlink(imagePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Resim silinirken hata:', unlinkErr);
                        } else {
                            console.log('Resim başarıyla silindi:', rows[0].image);
                        }
                    });
                }
            });
        }
        // Tarifin kendisini veritabanından sil
        await db.query('DELETE FROM recipes WHERE id = ? AND user_id = ?', [recipeId, userId]);
        res.json({ status: 'success', message: 'Tarif başarıyla silindi' });
    } catch (err) {
        console.error('Tarif silinirken hata:', err);
        res.status(500).json({ error: 'Tarif silinirken bir hata oluştu' });
    }
});


// DELETE: Kullanıcı blog silme (şifrelenmiş ID ile)
router.delete('/:id/blogs/:blogId', async (req, res) => {
    const userId = decodeId(req.params.id);
    const blogId = decodeId(req.params.blogId);
    if (!userId || !blogId) return res.status(400).json({ error: 'Geçersiz kullanıcı veya blog ID' });
    try {
        // Önce blogun veritabanında varlığını kontrol et
        const [rows] = await db.query('SELECT * FROM blogs WHERE id = ? AND user_id = ?', [blogId, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Blog bulunamadı veya bu blog sizin değil' });
        }
        // Blogun resim dosyasını sil
        if (rows[0].image) {
            const imagePath = path.join(__dirname, '..', 'public', 'images', 'blogs', rows[0].image);
            fs.access(imagePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.unlink(imagePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Resim silinirken hata:', unlinkErr);
                        } else {
                            console.log('Resim başarıyla silindi:', rows[0].image);
                        }
                    });
                }
            });
        }
        // Bloğun kendisini veritabanından sil
        await db.query('DELETE FROM blogs WHERE id = ? AND user_id = ?', [blogId, userId]);
        res.json({ status: 'success', message: 'Blog başarıyla silindi' });
    } catch (err) {
        console.error('Blog silinirken hata:', err);
        res.status(500).json({ error: 'Blog silinirken bir hata oluştu' });
    }
});

// Yüklenen dosyalar için klasör ve isim ayarı
// Kaydedilecek dizin ve dosya adı ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/avatars'); // Avatarlar için klasör
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'avatar-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // max 5MB
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new Error('Sadece JPG, JPEG ve PNG dosyalarına izin verilir!'));
        }
        cb(null, true);
    }
});

// PUT: Kullanıcı tarif güncelleme (şifrelenmiş ID ile)
router.put('/:id/recipes/:recipeId', upload.single('image'), async (req, res) => {
    const userId = decodeId(req.params.id);
    const recipeId = decodeId(req.params.recipeId);
    if (!userId || !recipeId) return res.status(400).json({ error: 'Geçersiz kullanıcı veya tarif ID' });
    try {
        // Önce tarifin veritabanında varlığını kontrol et
        const [rows] = await db.query('SELECT * FROM recipes WHERE id = ? AND user_id = ?', [recipeId, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Tarif bulunamadı veya bu tarif sizin değil' });
        }
        const currentRecipe = rows[0];
        const {
            title,
            description,
            difficulty,
            category_id,
            servings,
            reading_time,
            content
        } = req.body;
        const ingredients = req.body['ingredients[]'] || req.body.ingredients;
        // Güncelleme için gerekli alanları kontrol et

        const updates = [];
        const params = [];
        const compareAndPush = (field, value) => {
            if (
                value !== undefined &&
                value !== '' &&
                value !== currentRecipe[field]
            ) {
                updates.push(`${field} = ?`);
                params.push(value);
            }
        };
        // Başlık kontrolü
        compareAndPush('title', title);
        // Açıklama kontrolü
        compareAndPush('description', description);
        // Zorluk kontrolü
        compareAndPush('difficulty', difficulty);
        // Kategori kontrolü
        if (category_id) {
            updates.push('category_id = ?');
            params.push(category_id);
        }
        // Porsiyon kontrolü
        compareAndPush('servings', servings);
        // Okuma süresi kontrolü
        compareAndPush('reading_time', reading_time);
        // İçerik kontrolü
        compareAndPush('content', content);
        // Resim kontrolü
        let newImage = null;
        if (req.file) {
            newImage = req.file.filename;
            // Eski resim varsa sil
            if (currentRecipe.image) {
                const oldImagePath = path.join(__dirname, '..', 'public', 'images', 'recipes', currentRecipe.image);
                fs.access(oldImagePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(oldImagePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Eski resim silinirken hata:', unlinkErr);
                            } else {
                                console.log('Eski resim başarıyla silindi:', currentRecipe.image);
                            }
                        });
                    }
                });
            }
            updates.push('image = ?');
            params.push(newImage);
        } else {
            // Eğer yeni resim yüklenmediyse, eski resmi koru
            newImage = currentRecipe.image;
        }
        // Eğer hiçbir alan güncellenmemişse, hata döndür
        if (updates.length === 0) {
            return res.status(400).json({ error: 'Güncellenecek alan bulunamadı' });
        }
        // Güncelleme sorgusunu çalıştır
        params.push(recipeId, userId); // Son iki parametre ID'ler
        await db.query(`UPDATE recipes SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`, params);
        db.query('UPDATE recipes SET ingredients = ? WHERE id = ?', [ingredients.join(', '), recipeId]); // Malzemeleri güncelle
        console.log('Tarif güncellendi:', recipeId);
        res.json({ status: 'success', message: 'Tarif başarıyla güncellendi', newImage });
    } catch (err) {
        console.error('Tarif güncellenirken hata:', err);
        res.status(500).json({ error: 'Tarif güncellenirken bir hata oluştu' });
    }
});

// PUT: Kullanıcı blog güncelleme (şifrelenmiş ID ile)
router.put('/:id/blogs/:blogId', upload.single('image'), async (req, res) => {
    const userId = decodeId(req.params.id);
    const blogId = decodeId(req.params.blogId);
    if (!userId || !blogId) return res.status(400).json({ error: 'Geçersiz kullanıcı veya blog ID' });
    try {
        // Önce blogun veritabanında varlığını kontrol et
        const [rows] = await db.query('SELECT * FROM blogs WHERE id = ? AND user_id = ?', [blogId, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Blog bulunamadı veya bu blog sizin değil' });
        }
        const currentBlog = rows[0];
        const {
            title,
            description,
            content,
            category,
            reading_time,
        } = req.body;

        const updates = [];
        const params = [];
        const compareAndPush = (field, value) => {
            if (
                value !== undefined &&
                value !== '' &&
                value !== currentBlog[field]
            ) {
                updates.push(`${field} = ?`);
                params.push(value);
            }
        };
        // Başlık kontrolü
        compareAndPush('title', title);
        // Açıklama kontrolü
        compareAndPush('description', description);
        // Kategori kontrolü
        if (category) {
            updates.push('category_id = ?');
            params.push(category);
        }
        // Okuma süresi kontrolü
        compareAndPush('reading_time', reading_time);
        // İçerik kontrolü
        compareAndPush('content', content);
        // Resim kontrolü
        let newImage = null;
        if (req.file) {
            newImage = req.file.filename;
            // Eski resim varsa sil
            if (currentBlog.image) {
                const oldImagePath = path.join(__dirname, '..', 'public', 'images', 'blogs', currentBlog.image);
                fs.access(oldImagePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(oldImagePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Eski resim silinirken hata:', unlinkErr);
                            } else {
                                console.log('Eski resim başarıyla silindi:', currentBlog.image);
                            }
                        });
                    }
                });
            }
            updates.push('image = ?');
            params.push(newImage);
        } else {
            // Eğer yeni resim yüklenmediyse, eski resmi koru
            newImage = currentBlog.image;
        }
        // Eğer hiçbir alan güncellenmemişse, hata döndür
        if (updates.length === 0) {
            return res.status(400).json({ error: 'Güncellenecek alan bulunamadı' });
        }
        // Güncelleme sorgusunu çalıştır
        params.push(blogId, userId); // Son iki parametre ID'ler
        await db.query(`UPDATE blogs SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`, params);
        console.log('Blog güncellendi:', blogId);
        res.json({ status: 'success', message: 'Blog başarıyla güncellendi', newImage });
    } catch (err) {
        console.error('Blog güncellenirken hata:', err);
        res.status(500).json({ error: 'Blog güncellenirken bir hata oluştu' });
    }
});

router.post('/mainuser/', upload.single('image'), async (req, res) => {
    try {
        const {
            fullname,
            email,
            phone,
            gender,
            city,
            country,
            address,
            about,
            userId,
            avatarchanged,
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;


        // Kullanıcı ID'si kontrolü
        if (!userId) {
            return res.status(400).json({ error: 'Kullanıcı ID\'si gerekli' });
        }

        const image = req.file ? req.file.filename : null;
        console.log('Yüklenen resim:', image);

        // Kullanıcı verisini veritabanından al
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        const currentUser = rows[0];
        const updates = [];
        const params = [];

        // Yardımcı fonksiyon: değer karşılaştır
        const compareAndPush = (field, value) => {
            if (
                value !== undefined &&
                value !== '' &&
                value !== currentUser[field]
            ) {
                updates.push(`${field} = ?`);
                params.push(value);
            }
        };

        // Şifre değişikliği kontrolü
        if (currentPassword && newPassword && confirmPassword) {
            // Şifre doğrulama
            if (newPassword !== confirmPassword) {
                if (req.file) {
                    const newImagePath = path.join(__dirname, '..', 'public', 'images', 'avatars', req.file.filename);

                    // Dosya gerçekten var mı, güvenli sil
                    fs.access(newImagePath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            console.warn('Silinecek dosya bulunamadı (zaten silinmiş olabilir):', newImagePath);
                        } else {
                            fs.unlink(newImagePath, (err) => {
                                if (err) {
                                    console.error('Yeni resim silinirken hata:', err);
                                } else {
                                    console.log('Geçersiz yükleme silindi:', req.file.filename);
                                }
                            });
                        }
                    });
                }
                return res.status(400).json({ error: 'Yeni şifre ve onay şifresi eşleşmiyor' });
            }

            // Şifre uzunluğu kontrolü
            if (newPassword.length < 8) {
                if (req.file) {
                    const newImagePath = path.join(__dirname, '..', 'public', 'images', 'avatars', req.file.filename);

                    // Dosya gerçekten var mı, güvenli sil
                    fs.access(newImagePath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            console.warn('Silinecek dosya bulunamadı (zaten silinmiş olabilir):', newImagePath);
                        } else {
                            fs.unlink(newImagePath, (err) => {
                                if (err) {
                                    console.error('Yeni resim silinirken hata:', err);
                                } else {
                                    console.log('Geçersiz yükleme silindi:', req.file.filename);
                                }
                            });
                        }
                    });
                }
                return res.status(400).json({ error: 'Yeni şifre en az 8 karakter olmalıdır' });
            }

            // Mevcut şifre kontrolü
            const [passwordRows] = await db.query('SELECT u.gender FROM users u WHERE id = ? AND passwd = ?', [userId, currentPassword]);
            if (passwordRows.length === 0) {
                if (req.file) {
                    const newImagePath = path.join(__dirname, '..', 'public', 'images', 'avatars', req.file.filename);

                    // Dosya gerçekten var mı, güvenli sil
                    fs.access(newImagePath, fs.constants.F_OK, (accessErr) => {
                        if (accessErr) {
                            console.warn('Silinecek dosya bulunamadı (zaten silinmiş olabilir):', newImagePath);
                        } else {
                            fs.unlink(newImagePath, (err) => {
                                if (err) {
                                    console.error('Yeni resim silinirken hata:', err);
                                } else {
                                    console.log('Geçersiz yükleme silindi:', req.file.filename);
                                }
                            });
                        }
                    });
                }
                return res.status(400).json({ error: 'Mevcut şifre yanlış' });
            }

            // Şifre güncelleme
            updates.push('passwd = ?');
            params.push(newPassword);
        }

        // Alanları karşılaştır
        compareAndPush('fullname', fullname);
        compareAndPush('email', email);
        compareAndPush('phone', phone);
        compareAndPush('gender', gender);
        compareAndPush('city', city);
        compareAndPush('country', country);
        compareAndPush('address', address);
        compareAndPush('about', about);

        console.log('avatarchanged: ', avatarchanged)



        // Resim dosyası eklendiyse ve farklıysa
        if (image && avatarchanged === 'true') {
            // Eski resmi sil
            if (currentUser.avatar && currentUser.avatar !== 'default-avatar.png') {
                const oldImagePath = path.join('public/images/avatars', currentUser.avatar);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Eski resim silinirken hata:', err);
                });
            }
            // Yeni resmi ekle
            updates.push('avatar = ?');
            params.push(image);
            console.log('Yeni resim yüklendi:', image);
        }

        // Güncellenecek bir alan yoksa
        if (updates.length === 0) {
            return res.status(200).json({ status: 'değişiklik yok' });
        }

        // Güncelleme sorgusu
        const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
        params.push(userId);

        const [result] = await db.query(sql, params);

        res.status(200).json({ status: 'success', updatedFields: updates.map(u => u.split('=')[0].trim()) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

module.exports = router;