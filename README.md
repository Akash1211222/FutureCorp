# FutureCorp LMS - 3D Interactive Learning Management System

A modern, immersive learning management system built with React, Three.js, Node.js, and Supabase, featuring 3D interactive interfaces and real-time collaboration.

## 🚀 Features

### 🎮 3D Interactive Interface
- Immersive 3D dashboards and visualizations
- Interactive 3D models for learning concepts
- Responsive 3D design across all devices
- WebGL-powered smooth animations

### 👥 Multi-Role System
- **Students**: Personal dashboard, progress tracking, assignment submission
- **Teachers**: Student management, assignment creation, grade management
- **Admins**: System-wide management, user administration, analytics

### 💻 Advanced Learning Tools
- **Code Playground**: Multi-language IDE with syntax highlighting
- **Assignment System**: Auto-graded coding challenges
- **Live Classes**: Real-time video sessions with chat
- **AI Chatbot**: 24/7 learning assistance
- **Gamification**: Points, badges, and leaderboards

### 📊 Analytics & Progress Tracking
- 3D data visualizations
- Real-time progress monitoring
- Performance analytics
- Detailed reporting

## 🏗️ Architecture

### Frontend (React + Three.js)
```
frontend/
├── src/
│   ├── components/3d/       # Three.js components
│   ├── components/ui/       # UI components
│   ├── pages/               # Page components
│   ├── stores/              # Zustand state management
│   └── services/            # API services
```

### Backend (Node.js + Express)
```
backend/
├── src/
│   ├── controllers/         # Route controllers
│   ├── services/            # Business logic
│   ├── middleware/          # Custom middleware
│   └── routes/              # API routes
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Three.js** with React Three Fiber
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Monaco Editor** for code editing

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Supabase** for database and auth
- **Socket.IO** for real-time features
- **Winston** for logging
- **Zod** for validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone and setup:**
```bash
git clone <repository-url>
cd futurecorp-lms-3d
```

2. **Install dependencies:**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Environment Configuration:**

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

4. **Database Setup:**
```bash
# Run Supabase migrations
cd backend
npm run migrate
npm run seed
```

5. **Start Development Servers:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api/health

## 📱 Responsive Design

The application is fully responsive across all device types:

- **Desktop** (1920px+): Full 3D experience with advanced interactions
- **Laptop** (1024px-1919px): Optimized 3D interface
- **Tablet** (768px-1023px): Touch-friendly 3D controls
- **Mobile** (320px-767px): Simplified 3D with performance optimizations

## 🎯 Demo Accounts

After running the database seed, use these accounts:

- **Admin**: admin@futurecorp.test / Admin@123
- **Teacher**: teacher@futurecorp.test / Teacher@123  
- **Student**: alice@futurecorp.test / Student@123

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:visual   # Visual regression tests
```

### Backend Testing
```bash
cd backend
npm run test          # Unit and integration tests
npm run test:load     # Load testing
npm run test:security # Security testing
```

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

### Backend Build
```bash
cd backend
npm run build
npm start       # Run production server
```

## 🔧 Development Tools

### Code Quality
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Husky**: Git hooks

### Performance Monitoring
- **Lighthouse**: Performance auditing
- **Bundle Analyzer**: Bundle size analysis
- **Three.js Stats**: 3D performance monitoring

## 📚 Documentation

- [Implementation Roadmap](./docs/IMPLEMENTATION_ROADMAP.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [3D Component Guide](./docs/3D_COMPONENTS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@futurecorp.com
- Documentation: [docs.futurecorp-lms.com](https://docs.futurecorp-lms.com)

---

**Built with ❤️ by the FutureCorp Team**