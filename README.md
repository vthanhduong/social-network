# Pingee - Next.js 15 Social Media App

A modern, full-featured social media application built with Next.js 15, featuring real-time messaging, image uploads, and a beautiful UI. Connect with friends, share your thoughts, and stay updated with a seamless social experience.

## ✨ Features

- 🔐 **Google OAuth Authentication**: Secure user authentication with Google Sign-In
- 💬 **Real-time Messaging**: Powered by Stream Chat for instant communication
- 📝 **Rich Text Editor**: Create posts with TipTap editor supporting rich formatting
- 🖼️ **Media Upload**: Share images and videos with UploadThing integration
- 🔖 **Bookmarks**: Save your favorite posts for later
- ❤️ **Likes & Comments**: Engage with posts through likes and comments
- 👥 **Follow System**: Follow other users and build your network
- 🔔 **Notifications**: Stay updated with real-time notifications for likes, follows, and comments
- 🔍 **Search**: Find users and posts with full-text search
- #️⃣ **Hashtags**: Discover trending topics and content
- 🌓 **Dark Mode**: Full dark mode support with next-themes
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop
- ♾️ **Infinite Scroll**: Smooth content loading with infinite scroll
- 🖼️ **Image Cropping**: Built-in image cropper for profile pictures
- 🚀 **Optimized Performance**: Built with Next.js 15 App Router and React 19

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Lucia Auth](https://lucia-auth.com/) with Google OAuth
- **Real-time Chat**: [Stream Chat](https://getstream.io/chat/)
- **File Upload**: [UploadThing](https://uploadthing.com/)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **Rich Text Editor**: [TipTap](https://tiptap.dev/)
- **Image Processing**: [React Cropper](https://github.com/react-cropper/react-cropper)
- **HTTP Client**: [Ky](https://github.com/sindresorhus/ky)
- **Date Formatting**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📋 Prerequisites

- Node.js 18+ or 20+
- PostgreSQL database (Vercel Postgres recommended)
- pnpm, npm, or yarn
- Google OAuth App credentials
- UploadThing account
- Stream Chat account

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vthanhduong/social-network.git
cd social-network
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Fill in the required environment variables:

```env
# Database URLs (Vercel Postgres or any PostgreSQL database)
POSTGRES_PRISMA_URL=your-postgres-prisma-url
POSTGRES_URL_NON_POOLING=your-postgres-non-pooling-url

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Base URL (for production and OAuth callbacks)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# UploadThing (File upload service)
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
NEXT_PUBLIC_UPLOADTHING_APP_ID=your-uploadthing-app-id

# Stream Chat (Real-time messaging)
NEXT_PUBLIC_STREAM_KEY=your-stream-api-key
STREAM_SECRET=your-stream-secret

# Cron Secret (for scheduled jobs)
CRON_SECRET=your-random-cron-secret

# Node Environment
NODE_ENV=development
```

#### Setting up Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set the authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env` file

#### Setting up UploadThing:

1. Sign up at [UploadThing](https://uploadthing.com/)
2. Create a new app
3. Copy the App ID and Secret to your `.env` file

#### Setting up Stream Chat:

1. Sign up at [Stream](https://getstream.io/)
2. Create a new app
3. Copy the API Key and Secret to your `.env` file

### 4. Set up the database

Generate Prisma client:

```bash
npm run postinstall
```

Push the database schema (for development):

```bash
npx prisma db push
```

Or run migrations (for production):

```bash
npx prisma migrate deploy
```

### 5. Start development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🐳 Docker Deployment

### Build the Docker image

```bash
docker build -t pingee-social-app .
```

### Run the container

```bash
docker run -p 3000:3000 \
  -e POSTGRES_PRISMA_URL=your-postgres-url \
  -e POSTGRES_URL_NON_POOLING=your-postgres-url \
  -e GOOGLE_CLIENT_ID=your-google-client-id \
  -e GOOGLE_CLIENT_SECRET=your-google-client-secret \
  -e NEXT_PUBLIC_BASE_URL=https://yourdomain.com \
  -e UPLOADTHING_SECRET=your-uploadthing-secret \
  -e UPLOADTHING_APP_ID=your-uploadthing-app-id \
  -e NEXT_PUBLIC_UPLOADTHING_APP_ID=your-uploadthing-app-id \
  -e NEXT_PUBLIC_STREAM_KEY=your-stream-key \
  -e STREAM_SECRET=your-stream-secret \
  -e CRON_SECRET=your-cron-secret \
  pingee-social-app
```

## 📁 Project Structure

```
social-network/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/           # Authentication pages
│   │   │   ├── login/        # Login page
│   │   │   └── signup/       # Signup page
│   │   ├── (main)/           # Main app pages
│   │   │   ├── bookmarks/    # Bookmarked posts
│   │   │   ├── messages/     # Real-time messaging
│   │   │   ├── notifications/ # Notification center
│   │   │   ├── posts/        # Individual post pages
│   │   │   ├── search/       # Search functionality
│   │   │   └── users/        # User profiles
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── posts/        # Post CRUD operations
│   │   │   ├── users/        # User operations
│   │   │   ├── messages/     # Stream Chat integration
│   │   │   └── uploadthing/  # File upload endpoints
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── assets/               # Images and media
│   ├── components/           # React components
│   │   ├── comments/         # Comment system
│   │   ├── posts/            # Post components
│   │   │   └── editor/       # Post editor
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── prisma.ts         # Prisma client
│   │   ├── stream.ts         # Stream Chat client
│   │   ├── types.ts          # TypeScript types
│   │   ├── utils.ts          # Utility functions
│   │   └── validation.ts     # Zod schemas
│   └── auth.ts               # Lucia auth configuration
├── components.json           # shadcn/ui configuration
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── Dockerfile                # Docker configuration
```

## 🔧 Available Scripts

```bash
# Development
npm run dev                   # Start development server

# Production
npm run build                 # Build for production
npm run start                 # Start production server (standalone)

# Code Quality
npm run lint                  # Run ESLint

# Database
npm run postinstall           # Generate Prisma client
npx prisma studio             # Open Prisma Studio
npx prisma db push            # Push schema changes (dev)
npx prisma migrate deploy     # Run migrations (prod)
```

## 🎯 Key Features Explained

### Posts & Feed

- **For You Feed**: Personalized content feed with infinite scroll
- **Following Feed**: Posts from users you follow
- **Rich Text Editor**: Format your posts with bold, italic, lists, and more
- **Media Attachments**: Upload multiple images or videos per post
- **Hashtags**: Automatic hashtag detection and linking

### Social Interactions

- **Likes**: Double-tap or click to like posts
- **Comments**: Threaded comments with real-time updates
- **Bookmarks**: Save posts to your personal collection
- **Shares**: Share posts with others (coming soon)

### User Profiles

- **Customizable Profiles**: Set avatar, display name, and bio
- **Profile Statistics**: View follower/following counts and post stats
- **User Posts**: Browse all posts from a specific user
- **Follow/Unfollow**: Build your network

### Real-time Messaging

- **Direct Messages**: One-on-one chat with other users
- **Group Chats**: Create group conversations
- **Message Reactions**: React to messages with emojis
- **Typing Indicators**: See when others are typing
- **Read Receipts**: Track message read status

### Notifications

- **Real-time Updates**: Get notified instantly
- **Notification Types**: Likes, comments, follows
- **Unread Badge**: Visual indicator for new notifications
- **Mark as Read**: Manage your notification status

### Search & Discovery

- **Full-text Search**: Find users and posts
- **Hashtag Search**: Discover trending topics
- **User Search**: Find and connect with people

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_PRISMA_URL` | PostgreSQL connection URL for Prisma | Yes |
| `POSTGRES_URL_NON_POOLING` | Direct PostgreSQL connection URL | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `NEXT_PUBLIC_BASE_URL` | Application base URL | Yes |
| `UPLOADTHING_SECRET` | UploadThing secret key | Yes |
| `UPLOADTHING_APP_ID` | UploadThing app ID | Yes |
| `NEXT_PUBLIC_UPLOADTHING_APP_ID` | UploadThing app ID (public) | Yes |
| `NEXT_PUBLIC_STREAM_KEY` | Stream Chat API key | Yes |
| `STREAM_SECRET` | Stream Chat secret | Yes |
| `CRON_SECRET` | Secret for cron job authentication | Yes |
| `NODE_ENV` | Environment (development/production) | Auto-set |

## 📝 Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User accounts and profile information
- **sessions**: User authentication sessions
- **posts**: User posts with content and metadata
- **post_media**: Media attachments (images/videos)
- **comments**: Post comments
- **likes**: Post likes
- **bookmarks**: Saved posts
- **follows**: User follow relationships
- **notifications**: User notifications (likes, follows, comments)

### Key Relationships:

- One-to-Many: User → Posts, User → Comments
- Many-to-Many: Users ↔ Users (follows)
- Polymorphic: Notifications → Posts (optional)

## 🔒 Security Features

- **Lucia Auth**: Modern authentication library with session management
- **OAuth 2.0**: Secure authentication with Google
- **Password Hashing**: Secure password storage (for future email/password auth)
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Rate Limiting**: API rate limiting for sensitive operations
- **Secure Headers**: Security headers configured in Next.js
- **Environment Validation**: Runtime environment variable validation
- **SQL Injection Protection**: Parameterized queries via Prisma

## 🚧 Development Notes

- The app uses Next.js 15 App Router with Server Components
- TanStack Query for efficient data fetching and caching
- Optimistic updates for instant UI feedback
- Image optimization with Next.js Image component
- Standalone output mode for Docker deployment
- Full-text search enabled in Prisma for PostgreSQL
- Automated cron job for cleaning unused uploads

## 🎨 Customization

### Adding New UI Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add [component-name]
```

### Modifying Theme

Edit `src/app/globals.css` to customize the color palette:

```css
@layer base {
  :root {
    --background: ...;
    --foreground: ...;
    /* Add your custom colors */
  }
}
```

### Creating New API Routes

Add API routes in `src/app/api/[your-route]/route.ts`:

```typescript
import { validateRequest } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { user } = await validateRequest();
  
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Your API logic here
  return Response.json({ data: "..." });
}
```

## 📈 Performance Optimizations

- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Automatic image optimization with Next.js
- **Code Splitting**: Automatic code splitting per route
- **Caching**: TanStack Query caching strategy
- **Lazy Loading**: Components lazy loaded where appropriate
- **Database Indexing**: Optimized database indexes
- **CDN Integration**: UploadThing CDN for media files

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error:**
```bash
# Check your DATABASE_URL in .env
# Ensure PostgreSQL is running
npx prisma studio
```

**OAuth Redirect Error:**
```bash
# Verify NEXT_PUBLIC_BASE_URL matches your OAuth settings
# Check Google Cloud Console redirect URIs
```

**File Upload Issues:**
```bash
# Verify UploadThing credentials
# Check file size limits in your UploadThing dashboard
```

## 📄 License

This project is private and proprietary.

## 👤 Author

**Duong Vu Thanh**
- GitHub: [@vthanhduong](https://github.com/vthanhduong)
- Repository: [social-network](https://github.com/vthanhduong/social-network)

## 🤝 Contributing

This is a private project. If you have access and want to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Stream](https://getstream.io/) - Chat & Activity Feeds
- [UploadThing](https://uploadthing.com/) - File uploads made easy
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components

## 📮 Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/vthanhduong/social-network/issues).

---

Built with ❤️ using Next.js 15, React 19, and modern web technologies
