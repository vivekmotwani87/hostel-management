# 🏢 HostelEase - Full-Stack Hostel Management System

[![CI/CD Pipeline](https://github.com/vivekmotwani/hostel-management/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/vivekmotwani/hostel-management/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.8-white.svg)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20Ready-green.svg)](https://www.mongodb.com/)

A modern, responsive, and robust **Full-Stack Hostel Management System** built with **React, Tailwind CSS, Node.js, Express, MongoDB Mongoose, and Socket.IO**. Designed to streamline campus housing operations, room allotments, digital maintenance ticketing, fee payments, and resident communication.

---

## 📋 Comprehensive Checklist Verification

| Checklist Item | Requirement | Implementation Details |
| :--- | :--- | :--- |
| **1. Frontend Development** | React + Tailwind CSS | Responsive UI across mobile, tablet, and desktop with smooth hamburger drawers and grid layouts. |
| | Responsive Navigation | Mobile slide-in drawer, desktop persistent sidebar, active navigation pills. |
| | Dark / Light Mode | Integrated `ThemeContext` with localStorage persistence and CSS `dark:` utilities. |
| | Interactive UI | Form validation, animated loading indicators (`Loader.jsx`), dismissible toast alerts (`Toast.jsx`), accessible modals (`Modal.jsx`), and live search/filtering. |
| **2. React Concepts** | Hooks & Context | `useState`, `useEffect` (with cleanups), `useContext` (`AuthContext`, `ThemeContext`, `SocketContext`). |
| | Custom Hooks | `useDebounce` (for search performance), `useLocalStorage` (persisting theme/credentials). |
| **3. State Management** | React Context API | Modular contexts for Authentication, Global Theme, and Real-time WebSocket connection. |
| **4. Backend REST API** | Express RESTful API | Full CRUD for Auth, Rooms, Bookings, Complaints, Notices, Payments, and Chat. |
| **5. MongoDB + Mongoose** | Schemas & Validation | Mongoose models with validators, relationships (`ref`/`populate`), pre-save hooks, and indexes. |
| **6. Secure REST API** | Security Best Practices | `helmet`, `cors`, `morgan` logging, `express-validator`, `bcryptjs` password hashing, central error handling. |
| **7. Auth & Authorization** | JWT & User Roles | Stateless JWT tokens, protected routes, role-based access control (`admin`, `warden`, `student`). |
| **8. Real-Time Features** | WebSockets (Socket.IO) | Live duplex group chat, active user presence counter, typing indicators, and instant notice broadcasting. |
| **9. Docker** | Containerization | `backend/Dockerfile`, `frontend/Dockerfile` (Nginx multi-stage), and unified `docker-compose.yml`. |
| **10. DevOps & Deployment**| CI/CD & Cloud Ready | GitHub Actions pipeline (`ci-cd.yml`), `render.yaml` for 1-click deployment on Render, MongoDB Atlas ready. |
| **11. Project Quality** | Clean Architecture | Modular folder structure (`controllers`, `models`, `routes`, `middleware`, `components`, `context`). |
| **12. Testing** | Unit & Integration | Native Node.js test runner (`npm test`), comprehensive `postman_collection.json`. |
| **13. Deliverables** | Repository & Docs | README, Architecture Schemas, Sample Test Users, Presentation (`PRESENTATION.md`), Docker files. |

---

## 🔑 Pre-Configured Test User Credentials

The application provides instant 1-click demo login buttons on the login page:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Chief Warden / Admin** | `admin@hostel.com` | `admin123` | Full access: Add/edit rooms, approve/reject bookings, resolve complaints, broadcast notices, view analytics. |
| **Student Resident** | `student@hostel.com` | `student123` | Resident access: View assigned room & roommates, apply for rooms, file tickets, pay fees, live chat. |
| **Alternate Student** | `riya@hostel.com` | `student123` | Second student profile for testing room sharing and chat interactions. |

---

## 🏗️ Project Architecture & Directory Structure

```
hostel-management/
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # GitHub Actions CI/CD Pipeline
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection handler
│   ├── controllers/              # Business logic & request handling
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── chatController.js
│   │   ├── complaintController.js
│   │   ├── dashboardController.js
│   │   ├── noticeController.js
│   │   ├── paymentController.js
│   │   └── roomController.js
│   ├── middleware/               # Auth, validation, & error handling
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/                   # Mongoose database schemas
│   │   ├── Booking.js
│   │   ├── Complaint.js
│   │   ├── Message.js
│   │   ├── Notice.js
│   │   ├── Payment.js
│   │   ├── Room.js
│   │   └── User.js
│   ├── routes/                   # Express REST route definitions
│   ├── sockets/
│   │   └── socketHandler.js      # Socket.IO real-time events & rooms
│   ├── tests/
│   │   └── health.test.js        # Automated unit & config tests
│   ├── utils/
│   │   ├── generateToken.js      # JWT token helper
│   │   └── seedData.js           # Database seeding script
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js                 # Application entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/common/    # Navbar, Sidebar, Footer, Modal, Toast, Loader
│   │   ├── context/              # AuthContext, ThemeContext, SocketContext
│   │   ├── hooks/                # useDebounce, useLocalStorage
│   │   ├── pages/                # Home, Login, Register, Dashboard, Rooms,
│   │   │                         # Bookings, Complaints, Notices, Payments, Chat, Profile
│   │   ├── services/             # Axios API service with auth interceptor
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile                # Multi-stage Dockerfile with Nginx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── docker-compose.yml            # Multi-container orchestration
├── postman_collection.json       # Ready-to-import Postman API tests
├── render.yaml                   # 1-Click Render Cloud deployment blueprint
├── PRESENTATION.md               # Project presentation outline & slide deck
└── README.md
```

---

## 🚀 Quick Start Guide (Local Development)

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)
* **MongoDB** (Local instance or free MongoDB Atlas URI)

### 1. Clone & Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

*(Edit `.env` to update `MONGODB_URI` if using MongoDB Atlas)*

### 2. Seed Sample Database
Populate admin, students, rooms, bookings, tickets, and notices:
```bash
npm run seed
```

### 3. Start Backend Server
```bash
npm run dev
# Server will start on http://localhost:5001
```

### 4. Setup & Start Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
# Frontend will start on http://localhost:5173
```

Visit **http://localhost:5173** in your browser!

---

## 🐳 Running with Docker & Docker Compose

To launch the complete application (Frontend + Backend + MongoDB) inside isolated Docker containers:

```bash
docker-compose up --build
```

* **Frontend**: `http://localhost:3000`
* **Backend API**: `http://localhost:5001/api`
* **MongoDB**: `localhost:27017`

To stop containers:
```bash
docker-compose down
```

---

## ☁️ Connecting to MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a user (e.g., `hostel_admin` with password).
3. Under **Network Access**, add IP address `0.0.0.0/0` (allow access from anywhere) to allow Render and local dev to connect.
4. Click **Connect** ➔ **Drivers** ➔ Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/hostel_management?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user password and update `MONGODB_URI` in `backend/.env`.

---

## 🌐 Deploying to Render

### Method A: 1-Click Blueprint Deploy (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com/).
3. Click **New +** ➔ **Blueprint**.
4. Select your `hostel-management` repository. Render will automatically detect `render.yaml`.
5. Enter your `MONGODB_URI` environment variable when prompted.
6. Click **Apply**. Render will deploy both backend and frontend automatically!

### Method B: Manual Service Creation on Render
#### Backend Web Service:
* **Root Directory**: `backend`
* **Build Command**: `npm install`
* **Start Command**: `node server.js`
* **Environment Variables**:
  * `NODE_ENV`: `production`
  * `PORT`: `10000`
  * `MONGODB_URI`: `<Your MongoDB Atlas URI>`
  * `JWT_SECRET`: `<Random 32-character secret>`
  * `CLIENT_URL`: `https://your-frontend.onrender.com`

#### Frontend Static Site:
* **Root Directory**: `frontend`
* **Build Command**: `npm install && npm run build`
* **Publish Directory**: `dist`
* **Rewrite Rules**: `/*` ➔ `/index.html` (SPA routing)
* **Environment Variables**:
  * `VITE_API_URL`: `https://your-backend.onrender.com/api`
  * `VITE_SOCKET_URL`: `https://your-backend.onrender.com`

---

## 📡 REST API Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new resident/admin | Public |
| `POST` | `/api/auth/login` | Login & receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Private |
| `PUT` | `/api/auth/profile` | Update profile / password | Private |
| `GET` | `/api/rooms` | Query rooms (search & filters) | Public |
| `POST` | `/api/rooms` | Create new hostel room | Admin |
| `PUT` | `/api/rooms/:id` | Update room specifications | Admin |
| `DELETE` | `/api/rooms/:id` | Remove room from inventory | Admin |
| `GET` | `/api/bookings` | Fetch allotment requests | Private |
| `POST` | `/api/bookings` | Submit room application | Private |
| `PUT` | `/api/bookings/:id/status` | Approve / Reject application | Admin |
| `GET` | `/api/complaints` | Fetch maintenance tickets | Private |
| `POST` | `/api/complaints` | File maintenance ticket | Private |
| `PUT` | `/api/complaints/:id` | Update repair status & notes | Admin |
| `GET` | `/api/notices` | View hostel circulars | Public |
| `POST` | `/api/notices` | Broadcast new announcement | Admin |
| `DELETE` | `/api/notices/:id` | Delete announcement | Admin |
| `GET` | `/api/payments` | View fee payment records | Private |
| `POST` | `/api/payments` | Record digital fee payment | Private |
| `GET` | `/api/chat/:channel` | Fetch channel message history | Private |
| `GET` | `/api/dashboard/stats` | Unified dashboard analytics | Private |
| `GET` | `/api/health` | Service uptime and status check | Public |

*(Import `postman_collection.json` into Postman for pre-made requests with sample parameters).*

---

## 🧪 Testing

Run backend sanity and authentication token tests:
```bash
cd backend
npm test
```

Test frontend production bundle creation:
```bash
cd frontend
npm run build
```

---

## 📄 License
This project is open-source and released under the [MIT License](LICENSE).

