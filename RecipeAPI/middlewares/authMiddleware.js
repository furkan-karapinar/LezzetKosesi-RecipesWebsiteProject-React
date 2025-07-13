const jwt = require('jsonwebtoken');
const db = require('../db');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Authorization header eksik' });

  const token = authHeader.split(' ')[1]; // Bearer <token>


  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token geçersiz' });

    // Token veritabanında kayıtlı mı kontrol et
    const query = await db.query(
      'SELECT * FROM users WHERE id = ? AND token = ?', [decoded.user_id, token]);

    if (query.err || query.length === 0) {
      return res.status(401).json({ error: 'Token doğrulanamadı' });
    }
    req.user = query[0][0]; // Kullanıcıyı request'e ekle
    next();
  });
};

module.exports = authMiddleware;
