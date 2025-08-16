# 🎵 Spotify Clone - Microservice Platform

A complete microservice-based music streaming platform built with modern technologies, featuring user management, content administration, and scalable architecture.

## 🏗️ Architecture Overview

This platform follows a **microservice architecture** with the following services:

```
┌─────────────────┐    ┌─────────────────┐
│   User Service  │    │  Admin Service  │
│    (Port 3000)  │    │   (Port 7000)   │
│                 │    │                 │
│ • Authentication│    │ • Album CRUD    │
│ • User Profile  │    │ • Song CRUD     │
│ • Registration  │    │ • File Upload   │
│ • JWT Auth      │    │ • Content Mgmt  │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌─────────────────┐
         │   Shared Tech   │
         │                 │
         │ • MongoDB       │
         │ • PostgreSQL    │
         │ • Cloudinary    │
         │ • TypeScript    │
         └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (v6+)
- **PostgreSQL** (v14+)
- **Cloudinary Account**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Spotify
   ```

2. **Install dependencies for both services:**
   ```bash
   # User Service
   cd userService
   npm install
   
   # Admin Service
   cd ../adminService
   npm install
   ```

3. **Environment Setup:**
   
   Create `.env` files in both service directories:
   
   **userService/.env:**
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   MONGODB_URI=mongodb://localhost:27017/spotify_users
   ```
   
   **adminService/.env:**
   ```env
   PORT=7000
   NODE_ENV=development
   DATABASE_URL=postgresql://username:password@localhost:5432/spotify_admin
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   USER_URL=http://localhost:3000
   ```

4. **Database Setup:**
   ```bash
   # Start MongoDB
   mongod
   
   # Setup PostgreSQL (Admin Service)
   cd adminService
   npm run db:push
   ```

5. **Start Services:**
   ```bash
   # Terminal 1 - User Service
   cd userService
   npm run dev
   
   # Terminal 2 - Admin Service
   cd adminService
   npm run dev
   ```

## 📋 API Endpoints

### User Service (Port 3000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/users/register` | User registration |
| `GET` | `/api/v1/users/profile` | Get user profile |

### Admin Service (Port 7000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/admin/addAlbum` | Create new album |
| `POST` | `/api/v1/admin/addSong` | Upload song (audio only) |
| `PATCH` | `/api/v1/admin/addSongThumbnail` | Add thumbnail to song |
| `DELETE` | `/api/v1/admin/deleteSong/:songId` | Delete song |
| `DELETE` | `/api/v1/admin/deleteAlbum/:albumId` | Delete album |

## 🛠️ Technology Stack

### Backend Technologies
- **Framework:** Express.js with TypeScript
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod schemas
- **File Upload:** Multer + Cloudinary
- **Error Handling:** Custom middleware

### Databases
- **User Service:** MongoDB with Mongoose
- **Admin Service:** PostgreSQL with Drizzle ORM

### Cloud Services
- **File Storage:** Cloudinary (images/audio)
- **Database:** Neon (PostgreSQL)

## 📁 Project Structure

```
Spotify/
├── README.md                 # This file
├── userService/             # User management service
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middlewares/     # Auth, validation
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic
│   ├── package.json
│   └── README.md
├── adminService/           # Content management service
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── db/            # Drizzle schema
│   │   ├── middlewares/   # Auth, validation
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Helper functions
│   │   └── validators/    # Zod schemas
│   ├── drizzle/           # Database migrations
│   ├── package.json
│   └── README.md
```

## 🔧 Development Workflow

### Adding New Features

1. **Create feature branch:**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Service-specific development:**
   - For user features → work in `userService/`
   - For admin features → work in `adminService/`

3. **Database changes:**
   ```bash
   # Admin Service (PostgreSQL)
   npm run db:generate  # Generate migration
   npm run db:push      # Apply to database
   
   # User Service (MongoDB)
   # Schema changes in models/ directory
   ```

4. **Testing:**
   ```bash
   # Use Postman or similar tools
   # Test both services independently
   ```

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant U as User Service
    participant A as Admin Service
    
    C->>U: POST /register (name, email, password, role)
    U->>U: Hash password, save user
    U->>C: Return user data
    
    C->>U: Login request
    U->>C: Return JWT token
    
    C->>A: Admin request + JWT token
    A->>U: Validate token
    U->>A: User data + role
    A->>A: Check admin permissions
    A->>C: Protected resource
```

## 🎯 Features

### User Management
- ✅ User registration with role assignment
- ✅ JWT-based authentication
- ✅ Profile management
- ✅ Role-based access control

### Content Management
- ✅ Album creation with thumbnails
- ✅ Song upload (audio files)
- ✅ Separate thumbnail upload for songs
- ✅ CRUD operations for albums/songs
- ✅ File storage with Cloudinary

### Data Architecture
- ✅ Songs can exist without albums (singles)
- ✅ Albums maintain referential integrity
- ✅ Soft relationship management

## 🚧 Roadmap

### Phase 1 (Current)
- [x] Basic user registration
- [x] Admin content management
- [x] File upload functionality

### Phase 2 (Planned)
- [ ] User playlists
- [ ] Song streaming endpoints
- [ ] Search functionality
- [ ] User favorites

### Phase 3 (Future)
- [ ] Real-time features (WebSocket)
- [ ] Recommendation engine
- [ ] Social features
- [ ] Mobile app support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👥 Team

- **Backend Developer:** Microservice architecture, API design
- **Database Engineer:** Multi-database management
- **DevOps Engineer:** Service orchestration

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check individual service READMEs for specific documentation
- Review API documentation in `/docs` (coming soon)

---

**Built with ❤️ using modern microservice architecture**
