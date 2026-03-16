# FitHub — Gym E-Commerce & Booking Platform

> A production-ready full-stack web application for gym management, e-commerce, and fitness service booking. Built with Next.js 15, MongoDB, and Cloudinary.

🔗 🔗 **Live Demo:** [gym-e-commerce-ten.vercel.app](https://gym-e-commerce-ten.vercel.app/)
📂 **GitHub:** [github.com/NabilLamb/gym-e-commerce](https://github.com/NabilLamb/gym-e-commerce)

---

## Overview

FitHub is a complete gym management platform that combines an e-commerce store with a service booking system and a powerful admin dashboard. Users can browse and purchase premium gym equipment, supplements, and athletic wear — or book personal training sessions and group fitness classes directly through the platform.

The project was built to demonstrate production-level full-stack development skills including custom authentication, file uploads, admin workflows, SEO optimization, and responsive UI design.

---

## Screenshots

| | |
|---|---|
| ![Homepage](screenshots/homepage.png) | ![Products](screenshots/products.png) |
| **Homepage** — Hero, featured products, service cards | **Products Page** — Filter by category, pagination, discount badges |
| ![Product Detail](screenshots/product-detail.png) | ![Admin Dashboard](screenshots/admin-dashboard.png) |
| **Product Detail** — Image gallery, reviews, Add to Cart | **Admin Dashboard** — Stats, product/service/order management |
| ![Cart](screenshots/cart.png) | ![Checkout](screenshots/checkout.png) |
| **Cart** — Quantity stepper, order summary | **Checkout** — Shipping form, mock payment, order confirmation |
| ![Services](screenshots/services.png) | ![Booking](screenshots/booking.png) |
| **Services Page** — Category filter, Book Now | **Booking** — Service selection, check-in code confirmation |
| ![Profile](screenshots/profile.png) | ![Dark Mode](screenshots/dark-mode.png) |
| **Profile** — Orders history, booking history | **Dark Mode** — Full dark/light theme support |
| ![Contact](screenshots/contact.png) | ![Mobile](screenshots/mobile.png) |
| **Contact Page** — Form with validation | **Mobile** — Fully responsive on 375px |

---

## Features

### 🛍️ E-Commerce
- Product catalog with category filtering (Equipment, Supplements, Clothes)
- Product detail pages with image gallery, zoom/lightbox, video support
- Discount badge with calculated percentage (`-25%`)
- Product variants (size, color, stock per variant)
- Star ratings and customer reviews (add, edit)
- Persistent cart with localStorage — quantity stepper, real-time subtotal
- Cart validation on load — auto-removes out-of-stock or deleted items
- Checkout flow with shipping form and mock payment processing
- Order confirmation with order number and item summary
- Free shipping threshold progress bar

### 📅 Service Booking
- Browse fitness services with category filter
- Detailed service pages — duration, location, capacity, what's included
- Booking form with date/time picker and notes
- Auto-generated check-in codes (`FH-XXXXXX`)
- Booking confirmation page with full booking summary

### 👤 User Account
- Register / Login with JWT authentication (httpOnly cookies)
- Password strength indicator with live checklist
- Show/hide password toggle
- Profile page — edit display name
- Order history with status tracking
- Booking history (upcoming and past) with check-in codes
- Cart is cleared automatically on logout

### 🔐 Security
- Custom JWT authentication using `jose` (Edge-compatible)
- httpOnly cookies — XSS-safe token storage
- bcrypt password hashing (12 rounds)
- Timing attack prevention on login (dummy bcrypt compare)
- Input validation on every form — frontend and backend
- Regex validation for name, email, phone, password, ZIP
- Password requirements: 8+ chars, uppercase, lowercase, number
- HTML tag stripping on user-submitted text
- Route protection via Next.js middleware
- Admin role verification on every sensitive API route
- Public APIs filter inactive products (`$ne: false`)

### 🏋️ Admin Dashboard
- Live stats cards — Total Revenue, Orders, Bookings, Products
- **Products** — Add, edit, delete, toggle active/inactive, view detail page
- **Services** — Add, edit, delete, toggle active/inactive, view detail page
- **Orders** — View all orders, update status (Pending → Processing → Shipped → Delivered → Cancelled)
- **Bookings** — View all bookings, update status, view check-in codes
- **Messages** — View contact form submissions, mark read/unread, reply via email, delete
- Unread message badge counter on Messages tab
- Skeleton loading states — no layout shift on data load
- Dashboard tab state preserved in URL (`?tab=products`)
- Back to Dashboard button on detail pages preserves correct tab

### 🎨 UI / UX
- Dark / Light mode with system preference detection
- Athletic design system — `Barlow Condensed` headings, `DM Sans` body
- Primary accent color `#FF531A` (orange) used consistently
- Responsive — mobile-first, tested at 375px / 768px / 1280px
- Sticky navbar with scroll blur effect
- Animated background glows on hero and auth pages
- Skeleton loading states across all major pages
- Product image lightbox with fullscreen zoom
- Description `Read more / Show less` toggle on product and service detail
- Toast notifications for all user actions
- Empty state illustrations (cart, orders, bookings, messages)
- `cursor-pointer` on all interactive elements
- `focus-visible` rings for keyboard navigation
- `visited:` link color on content links
- Active nav link indicator (underline + primary color)

### 🔍 SEO
- Dynamic sitemap (`/sitemap.xml`) — auto-updates with new products and services
- `robots.txt` — blocks admin, API, and private routes from indexing
- OpenGraph and Twitter Card metadata
- Per-page titles using Next.js `metadata` and `generateMetadata`
- `display: swap` on Google Fonts for performance
- `next/image` with proper `alt` text throughout

### ⚡ Performance
- Next.js 15 App Router with Turbopack
- Server components for data fetching where possible
- `loading.tsx` files for products, services, and profile routes
- Branded 404 page (`not-found.tsx`)
- MongoDB aggregation pipeline for featured products scoring
- Image optimization via `next/image` and Cloudinary

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety throughout |
| Database | MongoDB + Mongoose | Data persistence |
| Auth | Custom JWT via `jose` | Edge-compatible authentication |
| Styling | Tailwind CSS v3 | Utility-first CSS |
| Components | shadcn/ui + Radix UI | Accessible UI primitives |
| Images | Cloudinary | Image/video upload and CDN |
| Fonts | Barlow Condensed + DM Sans | Google Fonts via next/font |
| Forms | React Hook Form + Zod | Form state and schema validation |
| Deployment | Vercel | Serverless hosting |
| Dev Tool | Turbopack | Fast bundler for development |

---

## Project Structure
```
fithub/
├── app/
│   ├── admin/                  # Admin dashboard + product/service forms
│   │   ├── products/add/
│   │   ├── products/edit/[id]/
│   │   ├── services/add/
│   │   ├── services/edit/[id]/
│   │   └── page.tsx            # Main dashboard with tabs
│   ├── api/
│   │   ├── auth/               # login, logout, register, me
│   │   ├── bookings/           # CRUD + status updates
│   │   ├── cart/validate/      # Cart item validation
│   │   ├── messages/           # Contact form messages
│   │   ├── orders/             # CRUD + status updates
│   │   ├── products/           # CRUD + toggle-active + reviews + featured
│   │   └── services/           # CRUD + toggle-active
│   ├── auth/                   # Login + Register page
│   ├── cart/                   # Shopping cart
│   ├── checkout/               # Checkout + order confirmation
│   ├── contact/                # Contact form + info
│   ├── products/
│   │   ├── [id]/               # Product detail (server wrapper + client)
│   │   └── page.tsx            # Product listing with filters + pagination
│   ├── profile/                # User account, orders, bookings
│   ├── services/
│   │   ├── [id]/               # Service detail (server wrapper + client)
│   │   ├── booking/            # Service booking form
│   │   └── page.tsx            # Service listing
│   ├── globals.css             # Design system + CSS variables
│   ├── layout.tsx              # Root layout with providers + metadata
│   ├── loading.tsx             # Root loading state
│   ├── not-found.tsx           # Branded 404 page
│   ├── page.tsx                # Homepage
│   └── sitemap.ts              # Dynamic sitemap generation
├── components/
│   ├── admin/
│   │   ├── AdminListRow.tsx    # Shared row component for products + services
│   │   ├── DeleteButton.tsx    # Confirm dialog delete button
│   │   ├── ProductForm.tsx     # Add/edit product form with Cloudinary
│   │   └── ServiceForm.tsx     # Add/edit service form with Cloudinary
│   ├── home/
│   │   ├── FeaturedProducts.tsx
│   │   └── ServiceCard.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   ├── footer.tsx              # Footer with auth-aware admin link
│   ├── header.tsx              # Sticky navbar with scroll blur
│   └── theme-provider.tsx
├── context/
│   ├── AuthContext.ts          # User auth state + login/logout/register
│   └── CartContext.ts          # Cart state + localStorage sync + logout clear
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   ├── getCurrentUser.ts       # Server-side auth helper
│   ├── jwt.ts                  # jose sign + verify
│   ├── mongodb.ts              # Mongoose connection with caching
│   ├── utils.ts                # cn() utility
│   └── validations.ts          # Centralized regex validation rules
├── models/
│   ├── Booking.ts
│   ├── Message.ts
│   ├── Order.ts
│   ├── Product.ts
│   ├── Review.ts
│   ├── Service.ts
│   └── User.ts
├── public/
│   ├── favicon.ico
│   ├── hero-image.png
│   ├── placeholder.jpg
│   └── robots.txt
└── middleware.ts               # Route protection + admin role check
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

### Installation
```bash
git clone https://github.com/yourusername/fithub.git
cd fithub
npm install
```

### Environment Variables

Create `.env.local` in the project root:
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fithub

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_PRESET_PRODUCTS=your_upload_preset

# Site URL (update to your deployed domain)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Create Admin Account

1. Register a new account through the UI
2. Open MongoDB Atlas → Collections → users
3. Find your user document and update the role:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

4. Log out and log back in — you'll now see the Admin Dashboard

---

## API Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/products` | Public | Get active products (supports `?all=true` for admin) |
| `POST` | `/api/products` | Admin | Create product |
| `GET` | `/api/products/featured` | Public | Get top-scored products |
| `GET` | `/api/products/:id` | Public | Get single product |
| `PUT` | `/api/products/:id` | Admin | Update product |
| `DELETE` | `/api/products/:id` | Admin | Delete product |
| `PATCH` | `/api/products/:id/toggle-active` | Admin | Toggle product visibility |
| `GET` | `/api/products/:id/reviews` | Public | Get product reviews |
| `POST` | `/api/products/:id/reviews` | Auth | Submit review |
| `PUT` | `/api/products/:id/reviews` | Auth | Edit own review |
| `GET` | `/api/services` | Public | Get active services |
| `POST` | `/api/services` | Admin | Create service |
| `PUT` | `/api/services` | Admin | Update service |
| `DELETE` | `/api/services` | Admin | Delete service |
| `GET` | `/api/services/:id` | Public | Get single service |
| `POST` | `/api/bookings` | Public | Create booking |
| `GET` | `/api/bookings` | Auth | Get bookings (own or all if admin) |
| `PATCH` | `/api/bookings` | Admin | Update booking status |
| `DELETE` | `/api/bookings` | Admin | Delete booking |
| `POST` | `/api/orders` | Auth | Place order |
| `GET` | `/api/orders` | Auth | Get orders (own or all if admin) |
| `PATCH` | `/api/orders` | Admin | Update order status |
| `DELETE` | `/api/orders` | Admin | Delete order |
| `POST` | `/api/messages` | Public | Submit contact message |
| `GET` | `/api/messages` | Admin | Get all messages |
| `PATCH` | `/api/messages` | Admin | Mark message read/unread |
| `DELETE` | `/api/messages` | Admin | Delete message |
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login |
| `POST` | `/api/auth/logout` | Public | Logout |
| `GET` | `/api/auth/me` | Auth | Get current user |
| `PATCH` | `/api/auth/me` | Auth | Update profile name |
| `POST` | `/api/cart/validate` | Public | Validate cart items exist + in stock |

---

## Security

- **JWT in httpOnly cookies** — tokens are inaccessible to JavaScript, preventing XSS attacks
- **bcrypt with 12 rounds** — strong password hashing
- **Timing-safe login** — dummy bcrypt compare always runs to prevent email enumeration
- **Input validation** — every form field validated with regex on both client and server
- **HTML sanitization** — user-submitted text fields strip HTML tags before saving
- **Route protection** — middleware blocks unauthenticated access to protected pages
- **Role-based API protection** — admin endpoints verify role on every request
- **`sameSite: strict` cookies** — CSRF protection
- **`secure` cookies in production** — HTTPS only

---

## Planned Features

- [ ] Google OAuth login via NextAuth.js
- [ ] Email OTP verification on registration
- [ ] Password reset via email
- [ ] Payment integration via Paddle (Morocco-compatible)
- [ ] Real-time notifications for order and booking status updates
- [ ] Customer wishlist / saved products
- [ ] Chat bot
- [ ] Mobile app via React Native

---

## License

MIT © 2026 — Built with ❤️ for athletes