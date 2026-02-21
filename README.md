# NewsPortal

A full-stack news portal application built with React.js (frontend) and Node.js + Express + Sequelize (backend).

## Tech Stack

**Frontend:** React.js, React Router, Axios, Vite  
**Backend:** Node.js, Express.js, Sequelize ORM, MySQL  
**Auth:** JWT (JSON Web Tokens)

## Features

- User registration and login (JWT-based authentication)
- Browse and read news articles (public)
- Search news by title and filter by category
- Admin panel to create, edit, and delete news articles
- Admin panel to manage categories
- Role-based access control (admin/user)

## Project Structure
```
NewsPortal/
├── backend/    # Node.js + Express REST API
└── frontend/   # React.js client
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL

### Backend Setup
```bash
cd backend
npm install
# Edit .env with your database credentials
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Default Admin Account
- Email: `admin@newsportal.com`
- Password: `admin123`

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Auth |
| GET | /api/news | Public |
| GET | /api/news/:id | Public |
| POST | /api/news | Admin |
| PUT | /api/news/:id | Admin |
| DELETE | /api/news/:id | Admin |
| GET | /api/categories | Public |
| POST | /api/categories | Admin |
| PUT | /api/categories/:id | Admin |
| DELETE | /api/categories/:id | Admin |
```

---

## 2 — Add a `.gitignore` in the root `NewsPortal/` folder

Create `NewsPortal/.gitignore`:
```
# Dependencies
node_modules/
backend/node_modules/
frontend/node_modules/

# Environment variables
backend/.env
frontend/.env

# Build output
frontend/dist/

# Logs
*.log
npm-debug.log*