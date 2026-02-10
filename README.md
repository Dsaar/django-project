# Django Project - Wander Notes 🌍✍️

Wander Notes is a full‑stack blog and travel diary platform built with **Django REST Framework** on the backend and **React + Material UI** on the frontend.

The application allows users to browse articles, filter by tags, comment on posts, and manage their own content, with a clean responsive UI and modern UX patterns such as snackbars, modals, and role‑based permissions.

---

## 🚀 Features

### 👤 Authentication & Users
- JWT authentication (login / register / logout)
- Automatic token refresh
- User profile support (display name, avatar)
- Role‑based permissions (owner / admin)

### 📝 Articles
- Create, read, update, delete articles
- Optional article hero image
- Tag system (many‑to‑many)
- Full-text search across:
  - Article title
  - Article content
  - Author username / name
  - Tags (case-insensitive)
- Combined filtering (search + tags)

- Latest articles endpoint
- Permission‑protected editing & deletion

### 💬 Comments
- Add, edit, delete comments
- Latest comments shown first
- View more / show less toggle
- Permission checks for comment management

### 🔔 UI & UX
- Responsive navbar with desktop & mobile drawer
- Global snackbar notifications
- Confirmation dialogs for destructive actions
- Clean layout with header, footer, and content areas
- Mobile‑friendly design using Material UI

---

## 🧱 Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- Simple JWT
- Django Filters
- CORS Headers

### Frontend
- React (Vite)
- React Router
- Material UI (MUI)
- Axios
- Context API

---

## 📁 Project Structure

### Backend (Django)
```
blog-management/
├── articles/
├── comments/
├── users/
├── common/
├── config/
├── manage.py
└── requirements.txt
```

### Frontend (React)
```
blog-client/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── contexts/
│   ├── router/
│   └── layout/
├── public/
└── package.json
```

---

## ⚙️ Backend Setup

### 1. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment variables

Create a `.env` file in the backend root:

```
SECRET_KEY=change-me-now
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

DB_ENGINE=sqlite
DB_NAME=db.sqlite3

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

ENVIRONMENT=development
LOG_LEVEL=INFO
```

### 4. Migrate & run
```bash
python manage.py migrate
python manage.py runserver
```

Backend runs on:
```
http://127.0.0.1:8000
```

---

## ⚙️ Frontend Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 🔌 API Overview

_All endpoints are fully documented and testable via the Django REST Framework Browsable API._

### Authentication
- `POST /api/token/`
- `POST /api/register/`
- `GET /api/me/`

### Articles
- `GET /api/articles/`
- `GET /api/articles/latest/`
- `POST /api/articles/`
- `PUT /api/articles/:id/`
- `DELETE /api/articles/:id/`

### Comments
- `GET /api/articles/:id/comments/`
- `POST /api/articles/:id/comments/`
- `PUT /api/comments/:id/`
- `DELETE /api/comments/:id/`

---

## 🔍 Search & Filtering

The articles endpoint supports advanced querying using Django REST Framework’s
filtering and search capabilities.

### Supported Query Parameters

| Parameter | Description | Example |
|---------|------------|---------|
| `search` | Searches title, content, author name, and tags | `?search=rome` |
| `tags__name__icontains` | Filter by tag (case-insensitive) | `?tags__name__icontains=travel` |
| Combined | Search + tag filter | `?search=italy&tags__name__icontains=food` |

Search is **case-insensitive** and powered by DRF’s `SearchFilter`.


---

## 🔐 Permissions

| Action | Requirement |
|------|-------------|
| View articles | Public |
| Create article | Authenticated |
| Edit/Delete article | Owner or Admin |
| Comment | Authenticated |
| Edit/Delete comment | Owner or Admin |

---

## 📚 API Documentation (Browsable API)

Wander Notes uses **Django REST Framework’s Browsable API** to provide
interactive, self-documenting endpoints.

### Accessing the API

| URL | Purpose |
|----|--------|
| `http://127.0.0.1:8000/api/` | API root (endpoint index) |
| `http://127.0.0.1:8000/api/articles/` | Articles endpoints |
| `http://127.0.0.1:8000/api-auth/login/` | Login for Browsable API |
| `http://127.0.0.1:8000/api-auth/logout/` | Logout |

### Authentication in Browsable API

- Uses **Session Authentication** for the Browsable API UI
- Uses **JWT authentication** for frontend / API clients
- Login via `/api-auth/login/` to test protected endpoints interactively

### What You Can Do in the Browsable API

- View all available endpoints
- See allowed HTTP methods (GET / POST / PUT / DELETE)
- Inspect serializers and field validation
- Submit requests directly from the browser

---

## 📦 Deployment Notes

- Backend is ready for deployment on services like Render / Railway
- Frontend can be deployed on Netlify or Vercel
- Update CORS and API base URLs accordingly


## ✨ Future Improvements
- Pagination for articles
- Rich text editor
- Likes / reactions
- User profiles page
- Search by title/content
- Admin dashboard

---

## 🧑‍💻 Author

Built with care as a full‑stack portfolio project showcasing:
- REST API design
- Authentication flows
- Frontend architecture
- Clean UX patterns

---

Enjoy using **Wander Notes** ✨
