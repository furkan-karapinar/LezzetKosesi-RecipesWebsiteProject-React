const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { decodeId, encodeId } = require('../utils');

// GET: Tüm tarifler (opsiyonel arama)
router.get('/', async (req, res) => {
  const search = req.query.s;

  const category = (req.query.category > 0) ? req.query.category : null || null;
  const time = req.query.time || null;
  const sort = req.query.sort || 'created_at';

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  try {
    let sql = `
   SELECT b.*,
    -- YORUMLARI JSON DİZİSİ OLARAK TOPLA
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', cm.id,
                'user_id', cm.user_id,
                'is_reply', cm.is_reply,
                'replyed_comment_id', cm.replyed_comment_id,
                'content', cm.content,
                'created_at', cm.created_at,
                'updated_at', cm.updated_at
            )
        )
        FROM comments cm
        WHERE cm.recipe_or_blog_id = b.id
          AND cm.is_recipe_comment = 0
    ) AS comments,

    -- YAZAR BİLGİLERİ
    u.fullname  AS author_fullname,
    u.username  AS author_username,
    u.avatar    AS author_avatar,
    c.category_name AS category_name,
    c.category_icon_path AS category_icon_path

FROM blogs b
LEFT JOIN users u ON u.id = b.user_id            -- yazar
LEFT JOIN categories c ON b.category_id = c.id
WHERE b.category_id = c.id  `;

    let page_info_sql = `SELECT COUNT(DISTINCT b.id) AS total
  FROM blogs b
  LEFT JOIN categories c ON b.category_id = c.id
  WHERE 1=1  `;


    let params = [];
    let countParams = [];

    if (search) {
      const keyword = '%' + decodeURIComponent(search) + '%';
      sql += ' AND ( b.title LIKE ? OR b.content LIKE ? ) ';
      page_info_sql += ' AND (b.title LIKE ? OR b.content LIKE ? ) ';
      params = [keyword, keyword];
      countParams = [keyword, keyword];
    }

    if (category) {
      const categoryId = decodeId(category);
      if (categoryId) {
        sql += ' AND b.category_id = ? ';
        page_info_sql += ' AND b.category_id = ? ';
        params.push(categoryId);
        countParams.push(categoryId);
      }
    }


    if (time) {
      if (time === 'quick') {
        sql += ' AND b.reading_time <= 30 ';
        page_info_sql += ' AND b.reading_time <= 30 ';
      } else if (time === 'medium') {
        sql += ' AND b.reading_time > 30 AND b.reading_time <= 60 ';
        page_info_sql += ' AND b.reading_time > 30 AND b.reading_time <= 60 ';
      } else if (time === 'long') {
        sql += ' AND b.reading_time > 60 ';
        page_info_sql += ' AND b.reading_time > 60 ';
      }
    }

    sql += ' GROUP BY b.id ';

    // sıralama -- popülerlik , en yeni, en eski
    if (sort === 'popular') {
      sql += ' ORDER BY b.view_count DESC';
    } else if (sort === 'newest') {
      sql += params.length ? ' ORDER BY b.created_at ASC' : ' ORDER BY b.created_at DESC';
    } else if (sort === 'oldest') {
      sql += params.length ? ' ORDER BY b.created_at DESC' : ' ORDER BY b.created_at ASC';
    }
    else { sql += ' ORDER BY b.created_at DESC'; }



    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);


    const [rows] = await db.query(sql, params);

    const [[countResult]] = await db.query(page_info_sql, countParams);
    const totalItems = countResult.total;
    const totalPages = Math.ceil(totalItems / limit);


    // ID'leri encode edip dönüyoruz
    const result = rows.map(recipe => ({
      ...recipe,
      id: encodeId(recipe.id),
      image: '/images/blogs/' + recipe.image, // resim URL'sini tam yapıyoruz
      author_avatar: '/images/avatars/' + recipe.author_avatar, // yazar avatar URL'sini tam yapıyoruz
      created_at: new Date(recipe.created_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
      updated_at: new Date(recipe.updated_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
      comments: JSON.parse(recipe.comments || '[]').map(comment => ({
        ...comment,
        id: encodeId(comment.id),
        user_id: encodeId(comment.user_id),
        created_at: new Date(comment.created_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
        updated_at: new Date(comment.updated_at).toLocaleString('tr-TR', { dateStyle: 'full' })
      })), // JSON.parse ile yorumları diziye çevirip ID'leri encode ediyoruz
      category_id: encodeId(recipe.category_id), // Kategori ID'sini encode ediyoruz
      category_icon_path: recipe.category_icon_path ? '/images/categories/' + recipe.category_icon_path : null // Kategori ikon URL'sini tam yapıyoruz
    }));

    res.json({
      status: 'success',
      blogs: result,
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


// GET: Tek tarif (şifrelenmiş ID ile)
router.get('/:id', async (req, res) => {
  const id = decodeId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Geçersiz ID' });

  try {
    const [rows] = await db.query(`
       SELECT b.*,
 b.*,

    -- YORUMLARI JSON DİZİSİ OLARAK TOPLA
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', cm.id,
                'user_id', cm.user_id,
                 'user_fullname', u.fullname,
        'user_avatar', u.avatar,
                'is_reply', cm.is_reply,
                'replyed_comment_id', cm.replyed_comment_id,
                'content', cm.content,
                'created_at', cm.created_at,
                'updated_at', cm.updated_at
            )
        )
        FROM comments cm
        JOIN users u ON u.id = cm.user_id
        WHERE cm.recipe_or_blog_id = b.id
          AND cm.is_recipe_comment = 0
    ) AS comments,

    -- YAZAR BİLGİLERİ
    u.fullname  AS author_fullname,
    u.username  AS author_username,
    u.avatar    AS author_avatar,

    c.category_name AS category_name,
    c.category_icon_path AS category_icon_path

FROM blogs b
LEFT JOIN users u ON u.id = b.user_id            -- yazar
LEFT JOIN categories c ON b.category_id = c.id
WHERE b.category_id = c.id AND b.id = ?
    `, [id]);

    if (rows.length === 0) return res.status(404).json({ error: 'Tarif bulunamadı' });

    const recipe = rows[0];
    recipe.id = encodeId(recipe.id); // ID encode'lu döndürülüyor
    recipe.created_at = new Date(recipe.created_at).toLocaleString('tr-TR', { dateStyle: 'full' });
    recipe.updated_at = new Date(recipe.updated_at).toLocaleString('tr-TR', { dateStyle: 'full' });
    recipe.image = '/images/blogs/' + recipe.image; // resim URL'sini tam yapıyoruz
    recipe.author_avatar = '/images/avatars/' + recipe.author_avatar; // yazar avatar URL'sini tam yapıyoruz
    recipe.comments = JSON.parse(recipe.comments || '[]').map(comment => ({
      ...comment,
      id: encodeId(comment.id),
      user_id: encodeId(comment.user_id),
      user_fullname: comment.user_fullname,
      user_avatar: '/images/avatars/' + comment.user_avatar, // kullanıcı avatar URL'sini tam yapıyoruz
      created_at: new Date(comment.created_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
      updated_at: new Date(comment.updated_at).toLocaleString('tr-TR', { dateStyle: 'full' })
    })); // JSON.parse ile yorumları diziye çevirip ID'leri encode ediyoruz
    recipe.category_id = encodeId(recipe.category_id); // Kategori ID'sini encode ediyoruz
    recipe.category_icon_path = recipe.category_icon_path ? '/images/categories/' + recipe.category_icon_path : null; // Kategori ikon URL'sini tam yapıyoruz

    res.json({
      status: 'success',
      blog: recipe
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Tarifin beğeni sayısını al
router.get('/:id/like-count', async (req, res) => {
  const id = decodeId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Geçersiz ID' });

  try {
    const [rows] = await db.query('SELECT count(*) AS like_count FROM likes WHERE recipe_or_blog_id = ? AND is_recipe = 0', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Tarif bulunamadı' });

    res.json({
      status: 'success',
      like_count: rows[0].like_count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET: Tarifin yer imleri sayısını al
router.get('/:id/bookmark-count', async (req, res) => {
  const id = decodeId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Geçersiz ID' });

  try {
    const [rows] = await db.query('SELECT count(*) AS bookmark_count FROM bookmarks WHERE recipe_or_blog_id = ? AND is_recipe = 0', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Tarif bulunamadı' });

    res.json({
      status: 'success',
      bookmark_count: rows[0].bookmark_count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Tarif yorumlama
router.post('/:id/comment/add', async (req, res) => {

  const blogId = decodeId(req.params.id);
  const { user_id, content } = req.body;

  if (!blogId || !user_id || !content) {
    return res.status(400).json({ error: 'Eksik alanlar' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO comments (recipe_or_blog_id, user_id, content, is_recipe_comment) VALUES (?, ?, ?, 0)',
      [blogId, decodeId(user_id), content]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Yorum eklenemedi' });
    }

      // Eklenen yorumun ID'sini al
       const commentId = result.insertId;
   
       // sql sorgusu ile o yorumu al ve json olarak döndür
       const query = `SELECT 
           cm.id as "id",
           cm.user_id as "user_id",
           u.fullname as "user_fullname",
           u.avatar as "user_avatar",
           cm.content as "content",
           cm.created_at as "created_at",
           cm.updated_at as "updated_at"
       FROM comments cm
       JOIN users u ON u.id = cm.user_id 
       WHERE cm.is_recipe_comment = 0 AND cm.id = ?`;
   
       const [commentRows] = await db.query(query, [commentId]);
       if (commentRows.length === 0) {
         return res.json({ error: 'Yorum bulunamadı' });
       }
       const comment = commentRows[0];
   
       res.status(201).json({ status: 'success', comment: {
         ...comment,
         id: encodeId(comment.id),
         user_id: encodeId(comment.user_id),
         user_avatar: '/images/avatars/' + comment.user_avatar, // kullanıcı avatar URL'sini tam yapıyoruz
         created_at: new Date(comment.created_at).toLocaleString('tr-TR', { dateStyle: 'full' }),
         updated_at: new Date(comment.updated_at).toLocaleString('tr-TR', { dateStyle: 'full' })
       }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Tarif yorum silme
router.delete('/:id/comment/delete/:commentId', async (req, res) => {
  const blogId = decodeId(req.params.id);
  const commentId = decodeId(req.params.commentId);
  const { user_id } = req.body;

  if (!blogId || !commentId || !user_id) {
    return res.status(400).json({ error: 'Eksik alanlar' });
  }

  try {
    const [result] = await db.query(
      'DELETE FROM comments WHERE id = ? AND recipe_or_blog_id = ? AND user_id = ? AND is_recipe_comment = 0',
      [commentId, blogId, decodeId(user_id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Yorum bulunamadı veya silme yetkiniz yok' });
    }

    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Yüklenen dosyalar için klasör ve isim ayarı
// Kaydedilecek dizin ve dosya adı ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/blogs');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'blog-' + uniqueSuffix + ext);
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


router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      category_id,
      reading_time,
      content,
      user_id,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    if (!title || !description || !category_id || !reading_time || !content || !image) {
      return res.status(400).json({ error: 'Tüm alanlar doldurulmalıdır' });
    }

    const sql = `
      INSERT INTO blogs (title, description, image, reading_time, user_id, category_id, content)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      title,
      description,
      image,
      reading_time,
      decodeId(user_id),
      decodeId(category_id),
      content,
    ];

    const [result] = await db.query(sql, params);
    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Blog eklenemedi' });
    }
    res.status(201).json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});


module.exports = router;