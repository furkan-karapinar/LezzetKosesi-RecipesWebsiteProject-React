// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');


const recipeRoutes = require('./routes/recipes');
const blogRoutes = require('./routes/blogs');

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images'))); // Statik dosyalar için

// 🔽 Burayı değiştirdik
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/recipe-categories', require('./routes/recipe-category'));
app.use('/api/v1/blog-categories', require('./routes/blog-category'));
app.use('/api/v1/users', require('./routes/users'));

app.listen(3000, () => {
  console.log('API çalışıyor: http://localhost:3000/api/v1/recipes');
});
