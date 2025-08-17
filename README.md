# 🎵 Spotify Clone - Microservice Platform

A complete microservice-based music streaming platform built with modern technologies, featuring user management, content administration, music streaming, and scalable architecture with Redis caching.

## 🏗️ Architecture Overview

This platform follows a **microservice architecture** with the following services:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Service  │    │  Admin Service  │    │   Song Service  │
│    (Port 3000)  │    │   (Port 7000)   │    │   (Port 8000)   │
│                 │    │                 │    │                 │
│ • Authentication│    │ • Album CRUD    │    │ • Music Streaming│
│ • User Profile  │    │ • Song CRUD     │    │ • Album Browsing│
│ • Registration  │    │ • File Upload   │    │ • Song Discovery│
│ • JWT Auth      │    │ • Content Mgmt  │    │ • Play Analytics│
│ • MongoDB       │    │ • Cache Inval.  │    │ • Redis Caching │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────┬───────────┴───────────┬───────────┘
                     │                       │
         ┌─────────────────┐    ┌─────────────────┐
         │   Shared Tech   │    │  Redis Cluster  │
         │                 │    │                 │
         │ • PostgreSQL    │    │ • Song Cache    │
         │ • Cloudinary    │    │ • Album Cache   │
         │ • TypeScript    │    │ • Play Count    │
         │ • JWT Auth      │    │ • Performance   │
         └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (v6+)
- **PostgreSQL** (v14+)
- **Redis** (v6+)
- **Cloudinary Account**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Spotify
   ```

2. **Install dependencies for all services:**
   ```bash
   # User Service
   cd userService
   npm install
   
   # Admin Service
   cd ../adminService
   npm install
   
   # Song Service
   cd ../songService
   npm install
   ```

3. **Environment Setup:**
   
   Create `.env` files in all service directories:
   
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
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   CACHE_EXPIRE=1800
   ```
   
   **songService/.env:**
   ```env
   PORT=8000
   NODE_ENV=development
   DATABASE_URL=postgresql://username:password@localhost:5432/spotify_admin
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   CACHE_EXPIRE=1800
   ```

4. **Database & Cache Setup:**
   ```bash
   # Start MongoDB
   mongod
   
   # Start Redis
   redis-server
   
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
   
   # Terminal 3 - Song Service
   cd songService
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
| `PATCH` | `/api/v1/admin/song/:id/toggle-status` | Toggle song active status |
| `PATCH` | `/api/v1/admin/song/:id/activate` | Activate song |
| `PATCH` | `/api/v1/admin/song/:id/deactivate` | Deactivate song |

### Song Service (Port 8000) - **Read Only**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/songs/albums` | Get all albums (cached) |
| `GET` | `/api/v1/songs/albums/:albumId/songs` | Get songs by album (cached) |
| `GET` | `/api/v1/songs/songs` | Get all songs (cached) |
| `GET` | `/api/v1/songs/songs/:id` | Get specific song (cached) |
| `PATCH` | `/api/v1/songs/songs/:id/play-count` | Increment play count |

## 🛠️ Technology Stack

### Backend Technologies
- **Framework:** Express.js with TypeScript
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod schemas
- **File Upload:** Multer + Cloudinary
- **Error Handling:** Custom middleware
- **Caching:** Redis with intelligent TTL strategies

### Databases
- **User Service:** MongoDB with Mongoose
- **Admin Service:** PostgreSQL with Drizzle ORM
- **Song Service:** PostgreSQL with Drizzle ORM (Read-only)

### Cloud Services & Infrastructure
- **File Storage:** Cloudinary (images/audio)
- **Database:** Neon (PostgreSQL)
- **Caching:** Redis (Local/Cloud)
- **Performance:** Multi-tiered caching strategy

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
│   │   ├── validators/    # Zod schemas
│   │   └── config/        # Redis, DB config
│   ├── drizzle/           # Database migrations
│   ├── package.json
│   └── README.md
└── songService/            # Music streaming service
    ├── src/
    │   ├── controllers/    # Request handlers
    │   ├── db/            # Drizzle schema
    │   ├── middlewares/   # Error handling
    │   ├── routes/        # API routes
    │   ├── config/        # Redis, DB config
    │   └── utils/         # Helper functions
    ├── package.json
    └── README.md
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

### Content Management (Admin Service)
- ✅ Album creation with thumbnails
- ✅ Song upload (audio files)
- ✅ Separate thumbnail upload for songs
- ✅ CRUD operations for albums/songs
- ✅ Song activation/deactivation
- ✅ File storage with Cloudinary
- ✅ Cache invalidation on data changes

### Music Streaming (Song Service)
- ✅ Album browsing with caching
- ✅ Song discovery and search
- ✅ Play count analytics
- ✅ Performance-optimized with Redis
- ✅ Read-only architecture for scalability

### Caching & Performance
- ✅ **Multi-tiered caching strategy**
- ✅ **Intelligent TTL management**:
  - Albums: 30 minutes (static content)
  - Songs: 15 minutes (moderate changes)
  - Songs by Album: 10 minutes (relationship data)
  - Individual Songs: 5 minutes (dynamic content)
- ✅ **Cache invalidation** on Admin operations
- ✅ **Graceful degradation** if Redis fails

### Data Architecture
- ✅ Songs can exist without albums (singles)
- ✅ Albums maintain referential integrity
- ✅ Soft relationship management
- ✅ Cross-service data consistency

## 🚧 Roadmap

### Phase 1 (Current)
- [x] Basic user registration
- [x] Admin content management
- [x] File upload functionality
- [x] Song streaming service
- [x] Redis caching implementation
- [x] Cache invalidation system

### Phase 2 (Planned)
- [ ] User playlists
- [ ] Advanced search functionality
- [ ] User favorites & history
- [ ] Song recommendations

### Phase 3 (Future)
- [ ] Real-time features (WebSocket)
- [ ] Advanced analytics dashboard
- [ ] Social features & sharing
- [ ] Mobile app support
- [ ] CDN integration

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
