# 🏛️ BBMP Community Issue Reporter

A full-stack web application for Bangalore citizens to report civic issues directly to BBMP (Bruhat Bengaluru Mahanagara Palike). Built with React frontend and Node.js/Express backend.

## ✨ Features

### For Citizens
- **Issue Reporting**: Report civic issues with detailed information
- **Real-time Tracking**: Track the status of reported issues
- **User Dashboard**: View and manage your reported issues
- **Profile Management**: Update personal information and ward details
- **Voting System**: Upvote/downvote issues to prioritize them

### For Administrators
- **Admin Dashboard**: Comprehensive overview of all reported issues
- **Issue Management**: Update status, assign issues, add notes
- **Statistics**: Real-time analytics and reporting
- **User Management**: View and manage user accounts

### General Features
- **Multi-page Application**: Home, About Us, Contact Us, Login/Register
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with BBMP branding
- **Authentication**: Secure user registration and login system
- **Role-based Access**: Different interfaces for users and admins

## 🚀 Tech Stack

### Frontend
- **React.js** - User interface framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd fullstack
```

### 2. Backend Setup
```bash
cd issue-tracker-backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/issue-tracker
JWT_SECRET=your-secret-key-here
PORT=5000
```

### 3. Frontend Setup
```bash
cd ../issue-tracker-frontend
npm install
```

### 4. Start the Application

**Backend:**
```bash
cd issue-tracker-backend
npm start
```

**Frontend:**
```bash
cd issue-tracker-frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Usage Guide

### For Citizens

1. **Register/Login**: Create an account or login with existing credentials
2. **Report Issues**: Use the issue form on the home page to report civic problems
3. **Track Issues**: View your reported issues in the dashboard
4. **Update Profile**: Manage your personal information and ward details

### For Administrators

1. **Admin Login**: Login with admin credentials
2. **View Dashboard**: See statistics and all reported issues
3. **Manage Issues**: Update status, add notes, assign issues
4. **Monitor Progress**: Track resolution progress and user feedback

## 🏗️ Project Structure

```
fullstack/
├── issue-tracker-backend/          # Backend API
│   ├── models/           # Database models
│   │   ├── Issue.js     # Issue schema
│   │   └── User.js      # User schema
│   ├── routes/          # API routes
│   │   ├── authRoutes.js    # Authentication routes
│   │   ├── issueRoutes.js   # Issue management routes
│   │   └── adminRoutes.js   # Admin-specific routes
│   └── server.js        # Main server file
├── issue-tracker-frontend/        # Frontend React app
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── api.js       # API configuration
│   │   └── styles.css   # Global styles
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Issues
- `GET /api/issues` - Get all issues (public)
- `POST /api/issues` - Create new issue (authenticated)
- `PUT /api/issues/:id/status` - Update issue status
- `GET /api/issues/user/my-issues` - Get user's issues

### Admin
- `GET /api/admin/statistics` - Get dashboard statistics
- `GET /api/admin/issues` - Get all issues with filters
- `PUT /api/admin/issues/:id` - Update issue details
- `GET /api/admin/users` - Get all users

### Static
- `GET /api/about` - About Us information
- `GET /api/contact` - Contact information

## 🎨 UI Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on all device sizes
- **Interactive Elements**: Hover effects, animations, and transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access**: Different permissions for users and admins
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin resource sharing configuration

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables (MONGODB_URI, JWT_SECRET)

### Frontend (Vercel)
1. Connect your GitHub repository
2. Set root directory to `issue-tracker-frontend`
3. Deploy automatically on push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and queries:
- Email: keerthirajmavanji305@gmail.com
- Phone: +91 7338234305

---

**Built with ❤️ for Bangalore** # Community-Issue-Reporter
