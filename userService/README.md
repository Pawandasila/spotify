# 👤 User Service - Spotify Clone

The **User Service** handles all user-related operations including authentication, registration, profile management, and role-based access control in the Spotify Clone microservice platform.

## 🎯 Service Overview

This service is responsible for:
- User registration and authentication
- JWT token generation and validation
- User profile management
- Role-based authorization (user/admin)
- MongoDB-based user data storage

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- npm or yarn

### Installation

1. **Navigate to service directory:**
   ```bash
   cd userService
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   
   Create `.env` file in the root of userService:
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_here
   MONGODB_URI=mongodb://localhost:27017/spotify_users
   ```

4. **Start MongoDB:**
   ```bash
   # Windows
   mongod
   
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux (systemd)
   sudo systemctl start mongod
   ```

5. **Run the service:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The service will be available at `http://localhost:3000`

## 📋 API Endpoints

### Authentication & Registration

#### Register User
```http
POST /api/v1/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"  // or "admin"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "64a7b8c9d1234567890abcdef",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "playlist": [],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get User Profile
```http
GET /api/v1/users/profile
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": {
    "_id": "64a7b8c9d1234567890abcdef",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "playlist": [],
    "profilePicture": null
  }
}
```

## 🏗️ Architecture

### Project Structure
```
userService/
├── src/
│   ├── index.ts                 # Entry point
│   ├── @types/
│   │   └── index.d.ts          # TypeScript definitions
│   ├── config/
│   │   ├── database.config.ts   # MongoDB connection
│   │   ├── env.config.ts        # Environment variables
│   │   └── Https.config.ts      # HTTP status codes
│   ├── controllers/
│   │   └── registerUser.controller.ts  # User registration logic
│   ├── enums/
│   │   └── error-code.enum.ts   # Error code definitions
│   ├── middlewares/
│   │   ├── AsyncHandler.middleware.ts   # Async error handling
│   │   ├── auth.middleware.ts           # JWT authentication
│   │   └── ErrorHandler.middleware.ts   # Global error handling
│   ├── models/
│   │   └── user.models.ts       # MongoDB user schema
│   ├── route/
│   │   └── route.ts            # API routes definition
│   ├── services/
│   │   └── user.service.ts     # Business logic
│   ├── utils/
│   │   ├── AppError.ts         # Custom error class
│   │   ├── Bcrypt.util.ts      # Password hashing
│   │   └── getEnv.util.ts      # Environment helper
│   └── validator/
│       └── user.validator.ts    # Zod validation schemas
├── package.json
├── tsconfig.json
└── README.md                    # This file
```

### Database Schema

**User Model:**
```typescript
{
  _id: ObjectId,           // MongoDB generated ID
  name: string,            // User's full name
  email: string,           // Unique email address
  password: string,        // Bcrypt hashed password
  role: "user" | "admin",  // User role for authorization
  playlist: string[],      // Array of playlist IDs
  profilePicture?: string, // Optional profile image URL
  createdAt: Date,         // Registration timestamp
  updatedAt: Date          // Last update timestamp
}
```

## 🔐 Security Features

### Password Security
- **Bcrypt hashing** with salt rounds
- **Minimum password requirements** (enforced by validation)
- **Password comparison** for authentication

### JWT Authentication
- **Token generation** on successful login
- **Token validation** middleware for protected routes
- **Role-based access control** (user/admin)

### Validation
- **Email format validation**
- **Password strength requirements**
- **Role validation** (only "user" or "admin" allowed)
- **Input sanitization** using Zod schemas

## 🛠️ Technology Stack

### Core Technologies
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Zod schemas

### Development Tools
- **TypeScript:** Type safety and better development experience
- **Nodemon:** Auto-reload during development
- **ESLint:** Code linting and formatting
- **Environment Management:** dotenv

## 🔧 Development

### Available Scripts

```bash
# Development with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Service port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/spotify_users` |

### Adding New Features

1. **Controller:** Add business logic in `src/controllers/`
2. **Service:** Add data operations in `src/services/`
3. **Model:** Define/update schemas in `src/models/`
4. **Route:** Add endpoints in `src/route/`
5. **Validation:** Create Zod schemas in `src/validator/`

### Testing User Registration

Using curl:
```bash
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpassword123",
    "role": "user"
  }'
```

Using Postman:
1. Set method to `POST`
2. URL: `http://localhost:3000/api/v1/users/register`
3. Headers: `Content-Type: application/json`
4. Body: JSON with name, email, password, role

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Restart MongoDB service
sudo systemctl restart mongod  # Linux
brew services restart mongodb-community  # macOS
```

**Port Already in Use:**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change PORT in .env
```

**JWT Token Issues:**
- Ensure `JWT_SECRET` is set in environment
- Check token format: `Bearer <token>`
- Verify token hasn't expired

## 📈 Performance Considerations

### Database Optimization
- **Indexes** on email field for faster queries
- **Connection pooling** for better performance
- **Mongoose lean queries** where appropriate

### Security Best Practices
- **Rate limiting** (can be added with express-rate-limit)
- **Input validation** on all endpoints
- **CORS configuration** for cross-origin requests
- **Helmet.js** for security headers

## 🔗 Integration

### With Admin Service
The User Service provides authentication for the Admin Service:

```javascript
// Admin Service validates tokens by calling:
GET http://localhost:3000/api/v1/users/profile
Authorization: Bearer <token>

// Returns user data with role for authorization
```

### Future Integrations
- **Playlist Service:** User playlist management
- **Streaming Service:** User listening history
- **Notification Service:** User notifications

## 📝 API Documentation

For detailed API documentation with request/response examples, see:
- [Postman Collection](./docs/postman-collection.json) *(coming soon)*
- [OpenAPI Specification](./docs/api-spec.yaml) *(coming soon)*

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include Zod validation for new endpoints
4. Add error handling with proper status codes
5. Update this README for new features

---

**Part of the Spotify Clone Microservice Platform** 🎵
