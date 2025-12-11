# ResetNow

> A modern clinical workflow system for managing patients, prescriptions, and medical certificates.

ResetNow is a full-stack web application designed to streamline clinical workflows for healthcare professionals. It provides an intuitive interface for managing patient records, creating prescriptions, generating medical certificates, and tracking clinical activities.

![ResetNow](https://img.shields.io/badge/ResetNow-Clinical%20Workflow-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-9.0-green)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Functionality

- **👤 Patient Management**
  - Add, edit, and search patient records
  - View patient history and medical records
  - Patient statistics and analytics

- **💊 Prescription Management**
  - Create and manage prescriptions
  - Medication tracking and billing information
  - Print-ready prescription templates

- **📄 Medical Certificates**
  - Generate medical certificates
  - Customizable certificate templates
  - Digital signature support

- **📊 Dashboard**
  - Real-time statistics and metrics
  - Visual charts and analytics
  - Activity tracking

- **⚙️ Settings & Profile**
  - Doctor profile management
  - Clinic information and availability
  - Legal credentials (License, PTR, S2)
  - Digital signature upload

### Security Features

- **🔐 Authentication**
  - Secure user registration and login
  - JWT-based authentication
  - Password reset via email (EmailJS integration)
  - Protected routes and API endpoints

- **🛡️ Security**
  - Password hashing with bcrypt
  - Token-based password reset
  - Secure token validation
  - Protected reset password routes

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2
- **Routing**: React Router DOM 7.9
- **UI Components**: 
  - Radix UI primitives
  - shadcn/ui components
  - Tailwind CSS 4.1
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts 3.5
- **PDF Generation**: React-PDF, jsPDF
- **Email**: EmailJS for password reset
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 5.2
- **Database**: MongoDB with Mongoose 9.0
- **Authentication**: JWT (jsonwebtoken)
- **Security**: 
  - bcryptjs for password hashing
  - Helmet for security headers
  - CORS for cross-origin requests
- **Development**: 
  - TypeScript 5.9
  - Nodemon for hot reloading
  - ts-node for TypeScript execution

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **MongoDB** (v6 or higher) - Local installation or MongoDB Atlas account
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/resetanow.git
cd resetanow
```

### 2. Install Dependencies

#### Frontend (Client)

```bash
cd client
npm install
```

#### Backend (Server)

```bash
cd server
npm install
```

## ⚙️ Configuration

### Environment Variables

#### Backend Configuration (`server/.env`)

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/resetanow
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resetanow

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port (optional, defaults to 5000)
PORT=5000

# Node Environment
NODE_ENV=development
```

#### Frontend Configuration (`client/.env`)

Create a `.env` file in the `client` directory:

```env
# EmailJS Configuration (for password reset)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# API URL (optional, defaults to http://localhost:5000/api)
VITE_API_URL=http://localhost:5000/api
```

### EmailJS Setup (Password Reset)

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Add an email service (Gmail, Outlook, etc.)
3. Create an email template with `{{reset_link}}` variable
4. Get your Service ID, Template ID, and Public Key
5. Add them to `client/.env`

For detailed EmailJS setup instructions, see the [EmailJS Documentation](https://www.emailjs.com/docs/).

## 🎯 Usage

### Development Mode

#### Start Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### Production Build

#### Build Backend

```bash
cd server
npm run build
npm start
```

#### Build Frontend

```bash
cd client
npm run build
npm run preview
```

## 📁 Project Structure

```
resetanow/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── features/       # Feature modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── dashboard/  # Dashboard
│   │   │   ├── patients/   # Patient management
│   │   │   ├── prescriptions/ # Prescription management
│   │   │   ├── medcert/    # Medical certificates
│   │   │   └── settings/   # Settings
│   │   ├── components/     # Reusable components
│   │   ├── shared/         # Shared utilities
│   │   └── App.tsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json
│
├── server/                  # Backend Express application
│   ├── src/
│   │   ├── features/       # Feature modules
│   │   │   ├── auth/       # Authentication routes & controllers
│   │   │   ├── patients/   # Patient routes & controllers
│   │   │   ├── prescriptions/ # Prescription routes & controllers
│   │   │   └── medcert/    # Medical certificate routes & controllers
│   │   ├── shared/         # Shared utilities
│   │   │   ├── config/     # Database configuration
│   │   │   ├── middleware/ # Auth middleware
│   │   │   └── utils/      # Utility functions
│   │   └── index.ts        # Server entry point
│   └── package.json
│
└── README.md
```

## 📚 API Documentation

### Authentication Endpoints

#### Register Doctor
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Dr. John Doe",
  "email": "doctor@example.com",
  "password": "securepassword",
  "licenseNo": "12345"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "doctor@example.com",
  "password": "securepassword"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "doctor@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "email": "doctor@example.com",
  "password": "newpassword"
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

#### Update Profile (Protected)
```http
PUT /api/auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Dr. John Doe",
  "title": "MD",
  "contactNumber": "+1234567890",
  ...
}
```

### Patient Endpoints

#### Get All Patients (Protected)
```http
GET /api/patients
Authorization: Bearer <jwt_token>
```

#### Create Patient (Protected)
```http
POST /api/patients
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "age": 35,
  "sex": "Female",
  "address": "123 Main St",
  ...
}
```

#### Get Patient by ID (Protected)
```http
GET /api/patients/:id
Authorization: Bearer <jwt_token>
```

#### Update Patient (Protected)
```http
PUT /api/patients/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Delete Patient (Protected)
```http
DELETE /api/patients/:id
Authorization: Bearer <jwt_token>
```

### Prescription Endpoints

#### Get All Prescriptions (Protected)
```http
GET /api/prescriptions
Authorization: Bearer <jwt_token>
```

#### Create Prescription (Protected)
```http
POST /api/prescriptions
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Medical Certificate Endpoints

#### Get All Medical Certificates (Protected)
```http
GET /api/medcerts
Authorization: Bearer <jwt_token>
```

#### Create Medical Certificate (Protected)
```http
POST /api/medcerts
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 🔐 Authentication

### How Authentication Works

1. **Registration/Login**: User registers or logs in, receives JWT token
2. **Token Storage**: Token stored in localStorage
3. **Protected Routes**: Frontend checks for valid token
4. **API Requests**: Token sent in Authorization header
5. **Token Validation**: Backend validates token on protected routes

### Password Reset Flow

1. User clicks "Forgot Password" on login page
2. Enters email address
3. Backend generates secure reset token (valid for 24 hours)
4. EmailJS sends email with reset link
5. User clicks link → redirected to reset password page
6. User enters new password
7. Backend validates token and updates password
8. User redirected to login page

## 💻 Development

### Code Style

- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier
- **Type Safety**: Strict TypeScript configuration

### Available Scripts

#### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

#### Backend

```bash
npm run dev      # Start development server with nodemon
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production server
```

### Adding New Features

1. Create feature folder in `client/src/features/` or `server/src/features/`
2. Follow existing patterns:
   - Components for UI
   - Services for API calls
   - Types for TypeScript definitions
   - Controllers for backend logic
   - Models for database schemas
   - Routes for API endpoints

## 🚢 Deployment

### Backend Deployment

1. Set environment variables in your hosting platform
2. Build the project: `npm run build`
3. Start the server: `npm start`
4. Ensure MongoDB connection is configured

### Frontend Deployment

1. Set environment variables
2. Build the project: `npm run build`
3. Deploy the `dist` folder to your hosting service
4. Configure API URL for production

### Recommended Hosting

- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Heroku, Railway, or DigitalOcean
- **Database**: MongoDB Atlas (cloud) or self-hosted MongoDB

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Ensure all tests pass
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License.

## 👥 Author

- **Justin Dimaandal** 

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the UI component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [EmailJS](https://www.emailjs.com/) for email functionality
- [React PDF](https://react-pdf.org/) for PDF generation

## 📞 Support

For support, email justindimz01@gmail.com or open an issue in the repository.

---

**Made with ❤️ for healthcare professionals**

