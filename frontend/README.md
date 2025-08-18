# 🎵 Spotify Clone - Frontend

A modern, responsive frontend application for the Spotify Clone platform built with Next.js 15, TypeScript, and Tailwind CSS. This React-based web application provides a seamless music streaming experience with user authentication, playlist management, and real-time audio playback.

## 🚀 Features

### 🎨 User Interface
- **Modern Design**: Spotify-inspired dark theme with smooth animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Component Library**: Built with shadcn/ui components and Tailwind CSS
- **Interactive Elements**: Hover effects, loading states, and smooth transitions

### 🔐 Authentication System
- **User Registration**: Sign up with name, email, and password
- **User Login**: Secure authentication with JWT tokens
- **Social Login**: Google and Twitter integration (OAuth)
- **Protected Routes**: Automatic redirection for authenticated content
- **Persistent Sessions**: Remember user login state across browser sessions

### 🎵 Music Features
- **Audio Playback**: Real-time music streaming with HTML5 audio
- **Play Controls**: Play, pause, next, previous, volume, and seek controls
- **Now Playing**: Display current song information with album artwork
- **Queue Management**: Add songs to queue and manage playback order
- **Progress Tracking**: Visual progress bar with time display

### 📱 Dashboard & Navigation
- **Home Dashboard**: Recently played, new releases, and personalized recommendations
- **Search Functionality**: Search songs, albums, and artists
- **Sidebar Navigation**: Easy access to playlists, library, and liked songs
- **Music Player**: Persistent bottom player across all pages

### 🎶 Playlist Management
- **Create Playlists**: Custom playlist creation with thumbnails
- **Manage Playlists**: Add/remove songs, edit details, delete playlists
- **Playlist Views**: Detailed playlist pages with song listings
- **Public/Private**: Control playlist visibility settings

### 🔍 Discovery & Browse
- **Browse Albums**: Explore album collections with detailed views
- **Artist Pages**: Dedicated artist profiles and discographies
- **Genre Filtering**: Browse music by categories and genres
- **Recommendations**: AI-powered music suggestions

## 🛠️ Technology Stack

### 🎯 Core Framework
- **Next.js 15**: React framework with App Router and server components
- **TypeScript**: Type-safe development with full IntelliSense support
- **React 18**: Latest React features with concurrent rendering

### 🎨 Styling & UI
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **shadcn/ui**: High-quality, accessible React components
- **Lucide Icons**: Beautiful, customizable SVG icon library
- **Framer Motion**: Smooth animations and micro-interactions

### 🔧 State Management
- **React Context**: Global state management for auth and music data
- **Custom Hooks**: Reusable logic for API calls and state handling
- **Local Storage**: Persistent client-side data storage

### 📡 API Integration
- **Axios**: HTTP client for API communication
- **RESTful APIs**: Integration with backend microservices
- **JWT Authentication**: Secure token-based authentication
- **Real-time Updates**: Live data synchronization

### 🎵 Audio & Media
- **HTML5 Audio**: Native browser audio playback capabilities
- **Audio Context API**: Advanced audio processing and visualization
- **Media Session API**: System media controls integration
- **Progressive Loading**: Efficient audio streaming and buffering

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Authentication routes
│   │   │   ├── login/              # Login page
│   │   │   └── register/           # Registration page
│   │   ├── dashboard/              # Main application routes
│   │   │   ├── playlist/[id]/      # Dynamic playlist pages
│   │   │   ├── search/             # Search functionality
│   │   │   └── page.tsx            # Dashboard home
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout component
│   │   └── page.tsx                # Landing page
│   ├── components/                 # Reusable React components
│   │   ├── custom/                 # Custom business logic components
│   │   │   ├── auth/               # Authentication components
│   │   │   ├── dashboard/          # Dashboard-specific components
│   │   │   │   ├── CreatePlaylistDialog.tsx
│   │   │   │   ├── MadeForYouCard.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── NewReleaseCard.tsx
│   │   │   │   ├── Player.tsx
│   │   │   │   ├── RecentlyPlayedCard.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── logo/               # Logo components
│   │   │   └── PlayButton.tsx      # Universal play button
│   │   └── ui/                     # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       └── ...
│   ├── context/                    # React Context providers
│   │   ├── auth.context.tsx        # Authentication state management
│   │   └── song.context.tsx        # Music and playlist state
│   └── lib/                        # Utility functions and configs
│       └── utils.ts                # Helper functions
├── public/                         # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── components.json                 # shadcn/ui configuration
├── eslint.config.mjs              # ESLint configuration
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependencies and scripts
├── postcss.config.mjs             # PostCSS configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Project documentation
```

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm/yarn/pnpm**: Package manager
- **Backend Services**: Admin, Song, and User services running

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spotify-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8002/api/v1
   NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_ADMIN_SERVICE_URL=http://localhost:8001/api/v1
   NEXT_PUBLIC_SONG_SERVICE_URL=http://localhost:8002/api/v1
   ```

### 🏃‍♂️ Development

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Start coding!**
   Edit files in `src/` and see changes instantly with hot reload

### 🏗️ Building for Production

1. **Create production build**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Run linting**
   ```bash
   npm run lint
   ```

## 🔧 Development Workflow

### 🎨 Styling Guidelines
- Use Tailwind CSS utility classes for styling
- Follow the established color scheme and spacing
- Implement responsive design with mobile-first approach
- Use shadcn/ui components for consistency

### 📝 Code Standards
- **TypeScript**: Strict typing with proper interfaces
- **ESLint**: Automated code quality checks
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, kebab-case for pages

### 🧪 Testing Strategy
- **Unit Tests**: Component testing with Jest and React Testing Library
- **Integration Tests**: API integration and user flow testing
- **E2E Tests**: End-to-end testing with Cypress
- **Performance**: Lighthouse scoring and Core Web Vitals

## 🌟 Key Components

### 🎵 Music Player (`Player.tsx`)
- **Real-time playback** with HTML5 audio
- **Volume control** and seeking functionality
- **Track information** display with artwork
- **Responsive design** for all screen sizes

### 🔍 Search (`search/page.tsx`)
- **Real-time search** across songs, albums, and artists
- **Filtered results** with type indicators
- **Play buttons** for immediate playback
- **Empty states** and loading indicators

### 📋 Playlist Management (`CreatePlaylistDialog.tsx`)
- **Modal-based** playlist creation
- **Image upload** for custom thumbnails
- **Form validation** with error handling
- **Success feedback** and state updates

### 🏠 Dashboard (`dashboard/page.tsx`)
- **Recently played** section with quick access
- **New releases** discovery feed
- **Personalized recommendations** based on listening history
- **Quick action** buttons for common tasks

## 🔗 API Integration

### 🔐 Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /auth/profile` - User profile data
- `POST /auth/logout` - Session termination

### 🎵 Music Endpoints
- `GET /songs` - Fetch all songs
- `GET /albums` - Fetch all albums
- `GET /songs/:id` - Get song details
- `PATCH /songs/:id/play-count` - Update play count

### 📋 Playlist Endpoints
- `GET /playlists` - User playlists
- `POST /playlists` - Create new playlist
- `GET /playlists/:id` - Playlist details
- `DELETE /playlists/:id` - Delete playlist

## 🚀 Deployment

### 🌐 Vercel Deployment

1. **Connect repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main branch

### 🐳 Docker Deployment

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

## 🎯 Performance Optimizations

### 🚀 Next.js Optimizations
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Pre-rendered pages for better SEO
- **API Routes**: Server-side API handling

### 🎵 Audio Optimizations
- **Progressive Loading**: Stream audio as it loads
- **Preloading**: Cache frequently played tracks
- **Buffer Management**: Optimize memory usage
- **Format Support**: Multiple audio format fallbacks

### 📱 User Experience
- **Skeleton Loading**: Smooth loading states
- **Error Boundaries**: Graceful error handling
- **Offline Support**: Service worker for offline functionality
- **PWA Features**: App-like experience on mobile

## 🔧 Troubleshooting

### 🚨 Common Issues

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**TypeScript Errors**
```bash
# Type checking
npm run type-check
# Fix linting issues
npm run lint:fix
```

**API Connection Issues**
- Verify backend services are running
- Check environment variable configuration
- Verify CORS settings on backend

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📋 Contribution Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed
- Follow the established code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Vercel** for hosting and deployment platform
- **Tailwind CSS** for the utility-first CSS framework
- **shadcn** for the beautiful UI component library
- **Spotify** for design inspiration

---

**Part of the Spotify Clone Microservice Platform** 🎵

**Related Services:**
- [User Service](../userService/README.md) - Authentication & User Management
- [Admin Service](../adminService/README.md) - Content Management & Administration
- [Song Service](../songService/README.md) - Music Streaming & Discovery

---

*Built with ❤️ using Next.js, TypeScript, and modern web technologies*
