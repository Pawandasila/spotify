# � Song Service - Music Streaming & Discovery

The **Song Service** is a read-only microservice designed for high-performance music streaming, album browsing, and song discovery. It implements intelligent Redis caching strategies to deliver lightning-fast responses for music consumption.

## 🎯 Service Overview

This service is responsible for:
- **Album browsing** with intelligent caching
- **Song discovery** and metadata retrieval
- **Play count tracking** and analytics
- **Music streaming endpoints** (read-only)
- **Performance optimization** with Redis
- **Scalable architecture** for high traffic

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│               Song Service                  │
│            (Read-Only)                      │
├─────────────────────────────────────────────┤
│  Controllers  │  Cache Layer │  Database    │
│  • Albums     │  • Redis     │  • PostgreSQL│
│  • Songs      │  • TTL Mgmt  │  • Read-Only │
│  • Playcount  │  • Hit/Miss  │  • Drizzle   │
│  • Discovery  │              │              │
├─────────────────────────────────────────────┤
│         Performance Features                │
│  • Multi-tiered Caching                    │
│  • Graceful Cache Degradation              │
│  • Intelligent TTL Strategies              │
│  • Database Connection Management          │
└─────────────────────────────────────────────┘
```

## 🚀 Features

### Core Functionality
- **Album Browsing**: Fast album listing with metadata
- **Song Discovery**: Efficient song search and retrieval
- **Play Analytics**: Track and increment play counts
- **Active Content**: Only serves active/published songs
- **RESTful Design**: Clean, intuitive API endpoints

### Performance & Caching
- **Multi-tiered Caching Strategy**:
  - Albums: 30 minutes (static content)
  - Songs: 15 minutes (moderate changes)
  - Songs by Album: 10 minutes (relationship data)
  - Individual Songs: 5 minutes (dynamic content)
- **Cache Indicators**: Response shows cache hit/miss status
- **Graceful Degradation**: Falls back to database if cache fails
- **Cache Invalidation**: Automatically cleared by Admin Service

## 📋 API Endpoints

### Album Discovery
| Method | Endpoint | Description | Cache TTL |
|--------|----------|-------------|-----------|
| `GET` | `/api/v1/songs/albums` | Get all albums | 30 min |
| `GET` | `/api/v1/songs/albums/:albumId/songs` | Get songs by album | 10 min |

### Song Discovery
| Method | Endpoint | Description | Cache TTL |
|--------|----------|-------------|-----------|
| `GET` | `/api/v1/songs/songs` | Get all songs | 15 min |
| `GET` | `/api/v1/songs/songs/:id` | Get specific song | 5 min |

### Analytics
| Method | Endpoint | Description | Cache Impact |
|--------|----------|-------------|--------------|
| `PATCH` | `/api/v1/songs/songs/:id/play-count` | Increment play count | Invalidates related caches |

## �️ Technology Stack

### Core Technologies
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM (Read-only)
- **Caching**: Redis with intelligent TTL management
- **Validation**: Zod schemas for request validation

### Performance Features
- **Connection Pooling**: Efficient database connections
- **Redis Clustering**: Scalable cache management  
- **Error Handling**: Comprehensive error management
- **Health Monitoring**: Database and cache status checks

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- Redis (v6+)
- Access to shared database with Admin Service

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup (.env):**
   ```env
   PORT=8000
   NODE_ENV=development
   
   # Database (Read-only access to Admin DB)
   DATABASE_URL=postgresql://username:password@localhost:5432/spotify_admin
   
   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   CACHE_EXPIRE=1800
   
   # Service URLs
   USER_URL=http://localhost:3000
   ADMIN_URL=http://localhost:7000
   ```
3. **Start service:**
   ```bash
   npm run dev
   ```

The service will be available at `http://localhost:8000`

## 📁 Project Structure

```
songService/
├── src/
│   ├── controllers/
│   │   └── album.controller.ts        # All endpoints logic
│   ├── config/
│   │   ├── redis.config.ts           # Redis configuration
│   │   ├── env.config.ts             # Environment variables
│   │   └── Https.config.ts           # HTTP status codes
│   ├── db/
│   │   ├── index.ts                  # Database connection
│   │   └── schema.ts                 # Drizzle schema (read-only)
│   ├── middlewares/
│   │   ├── AsyncHandler.middleware.ts # Async wrapper
│   │   └── ErrorHandler.middleware.ts # Error handling
│   ├── routes/
│   │   └── song.route.ts             # API routes
│   └── utils/
│       └── getEnv.util.ts            # Environment helpers
├── package.json
└── README.md
```

## 🔧 Caching Strategy Details

### Cache Key Structure
```
albums:all                    # All albums list
album:{albumId}:songs         # Songs for specific album
songs:all                     # All songs list
song:{songId}                 # Individual song data
```

### TTL Strategy Rationale

#### 🎫 Albums (30 minutes)
- **Why longest?** Albums are static content that rarely changes
- **Business logic:** Once created, album metadata is stable
- **Performance impact:** Enables fast navigation and browsing

#### 🎵 All Songs (15 minutes)
- **Why medium?** Songs list changes when new content is added
- **Balance:** Not as static as albums, but not as dynamic as individual songs

#### 📀 Songs by Album (10 minutes)
- **Why shorter?** Relationship data that can change when:
  - Songs are added/removed from albums
  - Song activation status changes
- **More dynamic:** Represents filtered views that update frequently

#### 🎤 Individual Songs (5 minutes)
- **Why shortest?** Individual songs have highest volatility:
  - Play counts increment frequently
  - Metadata might be updated
  - Status changes (active/inactive)
- **Real-time accuracy:** Users expect current play counts

### Cache Response Format
```json
{
  "success": true,
  "message": "Songs retrieved successfully (cached)",
  "data": [...],
  "count": 10,
  "cached": true  // Indicates cache hit/miss
}
```

## 📊 Response Examples

### Get All Albums (Cached)
```bash
GET http://localhost:8000/api/v1/songs/albums
```

**Response:**
```json
{
  "success": true,
  "message": "Albums retrieved successfully (cached)",
  "data": [
    {
      "id": 1,
      "title": "Greatest Hits",
      "artist": "Artist Name",
      "thumbnail": "https://cloudinary.com/...",
      "releaseDate": "2024-01-01",
      "description": "Best songs collection"
    }
  ],
  "count": 1,
  "cached": true
}
```

### Get Songs by Album
```bash
GET http://localhost:8000/api/v1/songs/albums/1/songs
```

**Response:**
```json
{
  "success": true,
  "message": "Songs retrieved successfully",
  "album": {
    "id": 1,
    "title": "Greatest Hits",
    "artist": "Artist Name",
    "thumbnail": "https://cloudinary.com/..."
  },
  "data": [
    {
      "id": 1,
      "title": "Hit Song",
      "artist": "Artist Name",
      "duration": "3:45",
      "audioUrl": "https://cloudinary.com/...",
      "genre": "Pop",
      "playCount": 1000,
      "isActive": true
    }
  ],
  "count": 1,
  "cached": false
}
```

### Increment Play Count
```bash
PATCH http://localhost:8000/api/v1/songs/songs/1/play-count
```

**Response:**
```json
{
  "success": true,
  "message": "Play count incremented successfully",
  "data": {
    "id": 1,
    "title": "Hit Song",
    "playCount": 1001,
    // ... other fields
  },
  "previousCount": 1000,
  "newCount": 1001
}
```

## 🔄 Database Integration

### Read-Only Access
- **Shared Database**: Uses same PostgreSQL instance as Admin Service
- **Read Operations Only**: No write operations to maintain data integrity
- **Connection Management**: Robust connection handling with retry logic
- **Schema Synchronization**: Automatically syncs with Admin Service schema

### Connection Health Monitoring
```typescript
// Health check endpoint includes database status
GET http://localhost:8000/health

{
  "service": "Song Service",
  "status": "healthy",
  "database": "connected",
  "redis": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "port": "8000"
}
```

## � Development

### Available Scripts
```bash
npm run dev          # Start development server with auto-reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run type-check   # Run TypeScript type checking
```

### Development Workflow
1. **Database Schema**: Syncs automatically with Admin Service
2. **Cache Testing**: Use different endpoints to test cache behavior
3. **Performance Monitoring**: Watch cache hit/miss ratios
4. **Error Handling**: Test graceful degradation scenarios

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Service port | `8000` |
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | PostgreSQL connection | Required |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password | Required |
| `CACHE_EXPIRE` | Default cache TTL | `1800` |

## 🔍 Monitoring & Analytics

### Cache Performance Metrics
- **Cache Hit Ratio**: Monitor via response `cached` field
- **TTL Effectiveness**: Track cache expiration patterns
- **Performance Gains**: Compare cached vs non-cached response times

### Logs & Debugging
```
✅ Cache hit: albums:all
❌ Cache miss: song:123
🗑️ Cache invalidated: songs:all
🔗 Redis client connected
📊 Database connection healthy
```

## 🤝 Integration

### With Admin Service
- **Shared Database**: Read-only access to Admin's PostgreSQL
- **Cache Coordination**: Admin Service invalidates Song Service cache
- **Data Consistency**: Maintains fresh data through cache invalidation

### With User Service
- **Authentication**: Can integrate JWT validation for user-specific features
- **User Analytics**: Track user listening behavior (future feature)

## 🔒 Security & Best Practices

- **Read-Only Database**: No write operations prevent data corruption
- **Input Validation**: All inputs validated with Zod schemas
- **Error Sanitization**: No sensitive data exposed in error responses
- **Rate Limiting**: Can be implemented for API protection
- **Health Monitoring**: Comprehensive service health checks

## 📈 Performance Optimization

### Cache Optimization
- **Intelligent TTL**: Different caching durations based on data volatility
- **Lazy Loading**: Cache populated on first request
- **Memory Efficient**: JSON serialization optimized for Redis

### Database Optimization
- **Read Replicas**: Can connect to read replicas for better performance
- **Connection Pooling**: Efficient connection management
- **Query Optimization**: Optimized queries for read operations

---

**Built for high-performance music streaming with intelligent caching** 🎵🚀
- **Pagination** for large result sets
- **Connection pooling** for concurrent users
- **Query optimization** for complex joins

### Streaming Performance
- **Efficient song lookup** by various criteria
- **Cached popular content** for faster access
- **Optimized playlist queries** with proper ordering
- **Batch operations** for bulk updates

### Scalability
- **Horizontal scaling** with read replicas
- **Caching layer** for frequently accessed data
- **CDN integration** for audio delivery
- **Background jobs** for analytics

## 🐛 Troubleshooting

### Common Issues

**Database Connection:**
```bash
# Test PostgreSQL connection
psql -d "your-database-url"

# Check if service is running
curl http://localhost:8000/health
```

**Service Integration:**
```bash
# Verify other services are running
curl http://localhost:3000/health  # User Service
curl http://localhost:7000/health  # Admin Service
```

**Missing Songs:**
- Ensure Admin Service has uploaded songs
- Check if songs are marked as `isActive: true`
- Verify database synchronization

## 🚧 Roadmap

### Phase 1 (Current)
- [x] Basic song discovery
- [x] Database schema setup
- [ ] Playlist CRUD operations
- [ ] Favorites management

### Phase 2 (Planned)
- [ ] Listening history tracking
- [ ] Play count analytics
- [ ] Search functionality
- [ ] Recommendation engine

### Phase 3 (Future)
- [ ] Real-time streaming
- [ ] Social features (shared playlists)
- [ ] Advanced analytics
- [ ] Mobile app support

## 🤝 Contributing

1. Follow existing database schema patterns
2. Add proper TypeScript types
3. Include error handling for all operations
4. Test with multiple users and playlists
5. Update this README for new features

---

**Part of the Spotify Clone Microservice Platform** 🎵

**Related Services:**
- [User Service](../userService/README.md) - Authentication & User Management
- [Admin Service](../adminService/README.md) - Content Management
