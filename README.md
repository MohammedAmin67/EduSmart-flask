# 🎓 EduSmart

**EduSmart** is a next-generation, gamified learning platform designed to make education engaging, personalized, and effective.  
Experience a seamless journey through interactive lessons, achievement tracking, and powerful analytics—all with a modern, beautiful interface.

---

## 🚩 Features at a Glance

- **📚 Interactive Lessons**  
  Dive into multimedia-rich content for an immersive learning experience.

- **🎮 Gamified Quizzes**  
  Challenge yourself with multiple question types—MCQs, fill-in-the-blank, drag-and-drop—and make learning fun.

- **🏆 Achievement Gallery**  
  Unlock badges and achievements as you progress, and collect them in your personal showcase.

- **🧬 XP & Level System**  
  Earn experience points, level up, and track your learning streaks with dynamic visual feedback.

- **📊 Analytics Dashboard**  
  Monitor your progress with daily stats, streaks, completion rates, and personalized insights.

- **👤 Personalized Profile**  
  View your XP, level, achievements, streaks, and recent activity in a unified dashboard.

- **🖼️ Avatar Upload**  
  Personalize your profile with custom avatars powered by Cloudinary.

- **🔐 Secure Authentication**  
  JWT-based authentication with bcrypt password hashing for maximum security.

- **🌗 Dark Mode**  
  Enjoy a visually pleasing interface with automatic light/dark theme support.

- **💡 Responsive Design**  
  Use EduSmart seamlessly on desktop, tablet, and mobile devices.

---

## 🛠️ Technology Stack

### **Frontend**
- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) for rapid, modern styling
- [Framer Motion](https://www.framer.com/motion/) for delightful animations
- [Axios](https://axios-http.com/) for API communication
- [React Router](https://reactrouter.com/) for navigation
- [React Hot Toast](https://react-hot-toast.com/) for notifications
- [Three.js](https://threejs.org/) for 3D graphics
- [GSAP](https://greensock.com/gsap/) for advanced animations

### **Backend**
- [Python 3.13](https://www.python.org/)
- [Flask](https://flask.palletsprojects.com/) - Lightweight web framework
- [Flask-CORS](https://flask-cors.readthedocs.io/) - Cross-Origin Resource Sharing
- [Gunicorn](https://gunicorn.org/) - Production WSGI server

### **Database**
- [SQLite](https://www.sqlite.org/) - Lightweight, serverless database
- Custom models with context managers for efficient connections

### **Authentication & Security**
- [PyJWT](https://pyjwt.readthedocs.io/) - JSON Web Tokens
- [bcrypt](https://github.com/pyca/bcrypt/) - Password hashing
- Token-based authentication with Bearer tokens

### **File Storage**
- [Cloudinary](https://cloudinary.com/) - Cloud-based image storage and optimization
- Automatic image resizing and optimization

### **Deployment**
- [Render](https://render.com/) - Full-stack deployment platform
- Automated CI/CD from GitHub

---

## 📁 Project Structure

```
EduSmart-flask/
├── backend-flask/              # Flask Backend
│   ├── config/                 # Configuration files
│   │   ├── cloudinary_config.py
│   │   └── database.py
│   ├── controllers/            # Request handlers
│   │   ├── auth_controller.py
│   │   └── user_controller.py
│   ├── middlewares/            # Authentication middleware
│   │   └── auth_middleware.py
│   ├── models/                 # Database models
│   │   └── user.py
│   ├── routes/                 # API routes
│   │   ├── auth_routes.py
│   │   └── user_routes.py
│   ├── utils/                  # Helper utilities
│   │   └── token_utils.py
│   ├── app.py                  # Main Flask application
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── api/               # API configuration
│   │   │   └── axios.js
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useLogout.js
│   │   │   ├── useAvatarUpload.js
│   │   │   ├── useLessons.js
│   │   │   ├── useQuizzes.js
│   │   │   └── useAnalytics.js
│   │   ├── utils/             # Helper utilities
│   │   ├── data/              # Mock data
│   │   ├── assets/            # Static assets
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── package.json           # Node dependencies
│   └── .env                   # Environment variables
│
├── render.yaml                # Render deployment config
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

---

## 🚀 Quick Start

### **Prerequisites**

- Python 3.13+
- Node.js 18+
- npm or yarn
- Git

---

## 🎯 Vision & Motivation

EduSmart is built for learners and educators seeking a more engaging, rewarding, and data-driven approach to education.  
Our mission is to inspire continuous learning through gamification, progress tracking, and an intuitive, visually-rich experience.

---

## 🐛 Known Issues

- Cold start delay on Render free tier (~30 seconds)
- SQLite not ideal for very large datasets (will migrate to PostgreSQL if needed)
- Avatar uploads require Cloudinary account

---

## 📊 Performance

- **Backend Response Time:** < 100ms average
- **Frontend Load Time:** < 2 seconds
- **Database Queries:** Optimized with context managers
- **Image Delivery:** CDN-powered via Cloudinary

---

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with expiration
- CORS configured for specific origins
- Input validation on all endpoints
- SQL injection prevention with parameterized queries
- XSS protection with sanitized inputs

---

## 📬 Contact & Support

- **Author:** [MohammedAmin67](https://github.com/MohammedAmin67)
- **GitHub:** [EduSmart-flask](https://github.com/MohammedAmin67/EduSmart-flask)
- **Email:** [mdamin67541@gmail.com]

---

<div align="center">

### **Made with ❤️ by Mohammed Amin**

⭐ **Star this repo if you find it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/MohammedAmin67/EduSmart-flask?style=social)](https://github.com/MohammedAmin67/EduSmart-flask)

---

**[⬆ Back to Top](#-edusmart)**

</div>