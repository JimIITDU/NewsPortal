# NewsPortal

A full-stack news portal built with React.js and Node.js.

## Tech Stack
**Frontend:** React.js, React Router, Axios, Vite  
**Backend:** Node.js, Express.js, Sequelize ORM, MySQL  
**Auth:** JWT Token-based Authentication

## Features
- 🔐 Register / Login with JWT auth
- 🌙 Dark / Light mode toggle
- 📰 Browse, search, filter news by category and tags
- 💬 Comment on articles
- ❤️ Like articles
- 🔖 Bookmark articles
- 👁️ View counter on articles
- 👤 User profile — edit name, change password
- 📋 Bookmarks and comment history on profile
- ⚙️ Admin dashboard with live stats
- 📊 Most viewed articles, articles per category charts
- 👥 User management — promote/demote/delete users
- 🗂️ Category management
- 📝 Full news CRUD for admins

## Setup

### Backend
```bash
cd backend
npm install
# Edit .env with your DB credentials
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Default Admin
- Email: `admin@newsportal.com`
- Password: `admin123`

## API Endpoints
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/news | Public |
| GET | /api/news/:id | Public |
| POST | /api/news | Admin |
| PUT | /api/news/:id | Admin |
| DELETE | /api/news/:id | Admin |
| GET | /api/categories | Public |
| POST | /api/categories | Admin |
| GET | /api/news/:id/comments | Public |
| POST | /api/news/:id/comments | Auth |
| DELETE | /api/news/:id/comments/:id | Auth/Admin |
| POST | /api/likes/:id/toggle | Auth |
| POST | /api/bookmarks/:id/toggle | Auth |
| GET | /api/bookmarks | Auth |
| GET | /api/users/profile | Auth |
| PUT | /api/users/profile | Auth |
| GET | /api/admin/stats | Admin |
| GET | /api/admin/users | Admin |
| PUT | /api/admin/users/:id/role | Admin |
| DELETE | /api/admin/users/:id | Admin |