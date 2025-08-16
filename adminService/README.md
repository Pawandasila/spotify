# 🎵 Admin Service - Spotify Clone

The **Admin Service** handles all content management operations including album creation, song uploads, file management, and administrative functions in the Spotify Clone microservice platform.

## 🎯 Service Overview

This service is responsible for:
- Album creation and management (CRUD)
- Song upload and management (audio files)
- Thumbnail management (separate from audio)
- File storage integration with Cloudinary
- PostgreSQL-based content data storage
- Admin authentication via User Service

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- Cloudinary account
- User Service running (for authentication)

### Installation

1. **Navigate to service directory:**
   ```bash
   cd adminService
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   
   Create `.env` file in the root of adminService:
   ```env
   PORT=7000
   NODE_ENV=development
   
   # Database (PostgreSQL)
   DATABASE_URL=postgresql://username:password@localhost:5432/spotify_admin
   
   # Cloudinary (File Storage)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # User Service Integration
   USER_URL=http://localhost:3000
   ```

4. **Database Setup:**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Generate migration (if needed)
   npm run db:generate
   ```

5. **Run the service:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The service will be available at `http://localhost:7000`

## 📋 API Endpoints

### Album Management

#### Create Album
```http
POST /api/v1/admin/addAlbum
Authorization: Bearer <admin_jwt_token>
Content-Type: multipart/form-data

Form Data:
- title: "Album Name"
- artist: "Artist Name"
- releaseDate: "2024-01-15"
- description: "Album description"
- thumbnail: <image_file>
```

**Response:**
```json
{
  "message": "Album added successfully",
  "album": {
    "id": 1,
    "title": "Album Name",
    "artist": "Artist Name",
    "releaseDate": "2024-01-15",
    "description": "Album description",
    "thumbnail": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "cloudinaryData": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "album/1234567890-album-name",
    "folder": "album"
  }
}
```

#### Delete Album
```http
DELETE /api/v1/admin/deleteAlbum/:albumId
Authorization: Bearer <admin_jwt_token>
```

### Song Management

#### Upload Song (Audio Only)
```http
POST /api/v1/admin/addSong
Authorization: Bearer <admin_jwt_token>
Content-Type: multipart/form-data

Form Data:
- title: "Song Title"
- artist: "Artist Name"
- albumId: 1 (optional)
- duration: 180 (in seconds)
- audio: <audio_file>
```

**Response:**
```json
{
  "message": "Song added successfully",
  "song": {
    "id": 1,
    "title": "Song Title",
    "artist": "Artist Name",
    "albumId": 1,
    "duration": 180,
    "audioUrl": "https://res.cloudinary.com/...",
    "thumbnail": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Add Song Thumbnail (Separate Endpoint)
```http
PATCH /api/v1/admin/addSongThumbnail
Authorization: Bearer <admin_jwt_token>
Content-Type: multipart/form-data

Form Data:
- songId: "1"
- thumbnail: <image_file>
```

**Response:**
```json
{
  "message": "Song thumbnail updated successfully",
  "song": {
    "id": 1,
    "title": "Song Title",
    "thumbnail": "https://res.cloudinary.com/...",
    // ... other song data
  }
}
```

#### Delete Song
```http
DELETE /api/v1/admin/deleteSong/:songId
Authorization: Bearer <admin_jwt_token>
```

## 🏗️ Architecture

### Project Structure
```
adminService/
├── src/
│   ├── index.ts                 # Entry point
│   ├── config/
│   │   ├── clodinary.ts        # Cloudinary + Multer config
│   │   ├── database.config.ts   # PostgreSQL connection
│   │   ├── dataUri.ts          # File conversion utilities
│   │   ├── env.config.ts       # Environment variables
│   │   └── Https.config.ts     # HTTP status codes
│   ├── controllers/
│   │   ├── addAlbum.controller.ts       # Album creation
│   │   ├── addSong.controller.ts        # Song upload (audio)
│   │   ├── addSongThumbnail.controller.ts # Thumbnail upload
│   │   └── delete.controller.ts         # Delete operations
│   ├── db/
│   │   ├── index.ts            # Database connection
│   │   └── schema.ts           # Drizzle schema definitions
│   ├── enums/
│   │   └── error-code.enum.ts  # Error code definitions
│   ├── middlewares/
│   │   ├── AsyncHandler.middleware.ts   # Async error handling
│   │   ├── ErrorHandler.middleware.ts   # Global error handling
│   │   ├── role.middleware.ts           # Role-based access
│   │   └── Shared.middleware.ts         # Authentication
│   ├── routes/
│   │   └── admin.route.ts      # API routes definition
│   ├── services/
│   │   ├── Album.service.ts    # Album business logic
│   │   └── song.service.ts     # Song business logic
│   ├── utils/
│   │   ├── AppError.ts         # Custom error class
│   │   ├── Bcrypt.util.ts      # Password utilities
│   │   └── getEnv.util.ts      # Environment helper
│   └── validator/
│       ├── album.validator.ts   # Album validation schemas
│       └── song.validator.ts    # Song validation schemas
├── drizzle/                     # Database migrations
│   ├── 0000_striped_sasquatch.sql
│   ├── 0001_boring_tenebrous.sql
│   └── 0002_sharp_maestro.sql
├── drizzle.config.ts           # Drizzle configuration
├── package.json
├── tsconfig.json
└── README.md                   # This file
```

### Database Schema

**Albums Table:**
```typescript
{
  id: number (Primary Key),
  title: string,
  artist: string,
  releaseDate: string,
  description?: string,
  thumbnail: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Songs Table:**
```typescript
{
  id: number (Primary Key),
  title: string,
  artist: string,
  albumId?: number (Foreign Key → albums.id),
  duration: number (in seconds),
  audioUrl: string,
  thumbnail?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Relationships
- **One-to-Many:** Album → Songs
- **Flexible:** Songs can exist without albums (singles)
- **Cascade Behavior:** Deleting album sets songs.albumId to null

## 🔧 File Upload Architecture

### Cloudinary Integration

**Folder Structure:**
```
Cloudinary/
├── album/              # Album thumbnails
├── songs/              # Audio files
└── song-thumbnails/    # Song thumbnails
```

**Upload Configurations:**

1. **Images (Albums/Thumbnails):**
   ```typescript
   {
     folder: "album" | "song-thumbnails",
     resource_type: "image",
     transformation: [
       { width: 300, height: 300, crop: "fill" },
       { quality: "auto", fetch_format: "auto" }
     ]
   }
   ```

2. **Audio (Songs):**
   ```typescript
   {
     folder: "songs",
     resource_type: "video", // For audio files
     timeout: 120000 // 2 minutes for large files
   }
   ```

### Multer Configuration

**Separate multer instances for different file types:**
- `upload`: For images (albums, thumbnails)
- `uploadAudio`: For audio files (songs)

## 🔐 Authentication & Authorization

### Authentication Flow
1. **Client** sends request with JWT token
2. **Admin Service** validates token with **User Service**
3. **User Service** returns user data with role
4. **Admin Service** checks if role is "admin"
5. **Admin Service** processes request or returns 403

### Middleware Chain
```
Request → Authentication → Role Check → Controller → Response
```

### Development Bypass
For development, you can use bypass authentication:
```typescript
// In admin.route.ts
const authMiddleware = bypassAuth; // For development
// const authMiddleware = isAdmin; // For production
```

## 🛠️ Technology Stack

### Core Technologies
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with Drizzle ORM
- **File Storage:** Cloudinary
- **File Upload:** Multer
- **Validation:** Zod schemas

### Development Tools
- **TypeScript:** Type safety
- **Drizzle Kit:** Database migrations
- **Nodemon:** Auto-reload during development
- **ESLint:** Code linting

## 🔧 Development

### Available Scripts

```bash
# Development with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Database operations
npm run db:generate    # Generate migration from schema changes
npm run db:push       # Push schema to database
npm run db:studio     # Open Drizzle Studio (database GUI)

# Type checking
npm run type-check

# Linting
npm run lint
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Service port | `7000` |
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |
| `USER_URL` | User Service URL | `http://localhost:3000` |

### Database Operations

**Creating Migrations:**
```bash
# 1. Modify schema in src/db/schema.ts
# 2. Generate migration
npm run db:generate

# 3. Push to database
npm run db:push
```

**Database Studio:**
```bash
# Open visual database editor
npm run db:studio
```

### Testing Endpoints

**Using Postman:**

1. **Get Admin JWT Token:**
   - Register/login as admin via User Service
   - Copy JWT token from response

2. **Test Album Creation:**
   - Method: `POST`
   - URL: `http://localhost:7000/api/v1/admin/addAlbum`
   - Authorization: `Bearer <token>`
   - Body: Form-data with album details + image

3. **Test Song Upload:**
   - Method: `POST`
   - URL: `http://localhost:7000/api/v1/admin/addSong`
   - Authorization: `Bearer <token>`
   - Body: Form-data with song details + audio file

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed:**
```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -d "postgresql://username:password@localhost:5432/spotify_admin"
```

**Cloudinary Upload Errors:**
```bash
# Common errors:
# 1. EPROTO/ECONNRESET → Network issues (retry logic implemented)
# 2. Invalid credentials → Check API keys
# 3. File too large → Check Cloudinary limits
```

**Authentication Issues:**
```bash
# Ensure User Service is running on correct port
curl http://localhost:3000/health

# Check JWT token format
# Should be: Authorization: Bearer <token>
```

**File Upload Problems:**
```bash
# Check file types supported:
# Images: jpg, jpeg, png, gif, webp
# Audio: mp3, wav, flac, aac, ogg

# Check file size limits (Cloudinary free tier):
# Images: 10MB
# Audio: 100MB
```

## 📈 Performance Considerations

### File Upload Optimization
- **Retry logic** for failed uploads
- **Timeout configuration** for large files
- **Compression** for images
- **Streaming** for large audio files

### Database Optimization
- **Indexes** on frequently queried fields
- **Connection pooling** with Drizzle
- **Query optimization** with proper joins

### Cloudinary Best Practices
- **Folder organization** for better management
- **Transformation chaining** for optimized delivery
- **Auto-format** for best file formats

## 🔗 Integration Points

### With User Service
- **Authentication validation**
- **Role verification**
- **User profile data**

### With Future Services
- **Streaming Service:** Audio file URLs
- **Search Service:** Album/song metadata
- **Analytics Service:** Upload statistics

## 🚧 Known Limitations

1. **File Size:** Limited by Cloudinary free tier (100MB for audio)
2. **Concurrent Uploads:** May cause SSL issues with large files
3. **Storage:** Files stored on Cloudinary (external dependency)
4. **Authentication:** Depends on User Service availability

## 🔮 Future Enhancements

### Planned Features
- [ ] Batch upload for multiple songs
- [ ] Audio file transcoding
- [ ] Advanced search and filtering
- [ ] Analytics dashboard
- [ ] Backup and restore functionality

### Performance Improvements
- [ ] CDN integration for faster delivery
- [ ] Caching layer for frequently accessed data
- [ ] Background job processing for uploads
- [ ] Real-time upload progress tracking

## 📝 API Documentation

For detailed API documentation:
- **Swagger/OpenAPI:** `http://localhost:7000/docs` *(coming soon)*
- **Postman Collection:** [Download here](./docs/postman-collection.json) *(coming soon)*

## 🤝 Contributing

1. Follow existing code structure and patterns
2. Add proper TypeScript types for all functions
3. Include Zod validation for new endpoints
4. Add comprehensive error handling
5. Update database schema if needed
6. Test with both development and production configurations
7. Update this README for new features

---

**Part of the Spotify Clone Microservice Platform** 🎵
