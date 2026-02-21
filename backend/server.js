require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/news/:newsId/comments', commentRoutes);

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB connection error:', err));