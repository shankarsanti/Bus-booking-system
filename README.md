# Bus Booking System

A modern, full-featured bus booking platform built with React, Firebase, and Vite.

## Features

- **Multi-Role System**: Customer, Agent, and Admin panels
- **Real-time Booking**: Search buses, select seats, and book tickets
- **Payment Integration**: Secure payment processing
- **User Authentication**: Phone OTP and username/password login
- **Seat Selection**: Interactive seat layout with real-time availability
- **Booking Management**: View, track, and manage bookings
- **Admin Dashboard**: Manage buses, routes, trips, agents, and bookings
- **Agent Portal**: Dedicated interface for booking agents
- **Reports & Analytics**: Comprehensive reporting system
- **Loyalty Program**: Customer rewards and points system
- **Support System**: Customer support ticket management
- **Refund Processing**: Automated refund handling

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions)
- **UI Components**: Lucide React icons, Recharts for analytics
- **PDF Generation**: jsPDF for ticket generation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

### Environment Setup

Create a `.env` file in the `frontend` directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

Frontend:
```bash
cd frontend
npm run dev
```

Backend (Firebase Functions):
```bash
cd backend
npm run serve
```

### Build

Frontend:
```bash
cd frontend
npm run build
```

Backend:
```bash
cd backend
npm run build
```

### Deployment

Deploy frontend and backend separately:

```bash
# Deploy frontend (from frontend directory)
cd frontend
npm run build
# Then deploy to your hosting service (Vercel, Netlify, etc.)

# Deploy backend functions (from backend directory)
cd backend
npm run deploy
```

## Project Structure

```
├── frontend/             # Frontend application
│   ├── src/
│   │   ├── app/         # Application pages
│   │   │   ├── admin/   # Admin panel
│   │   │   ├── agent/   # Agent panel
│   │   │   ├── customer/# Customer panel
│   │   │   └── api/     # API routes
│   │   ├── components/  # Reusable components
│   │   ├── lib/         # Utility libraries
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Helper functions
│   ├── public/          # Static assets
│   └── package.json     # Frontend dependencies
│
├── backend/             # Backend services
│   ├── src/            # Firebase Cloud Functions
│   │   ├── index.ts    # Main functions entry
│   │   ├── loyalty.ts  # Loyalty program
│   │   ├── refunds.ts  # Refund processing
│   │   ├── support.ts  # Support tickets
│   │   └── ...         # Other services
│   └── package.json    # Backend dependencies
│
├── firebase.json        # Firebase configuration
├── firestore.rules      # Firestore security rules
├── firestore.indexes.json # Firestore indexes
└── README.md           # This file
```

## License

Private
