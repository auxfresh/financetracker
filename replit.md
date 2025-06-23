# Personal Finance Manager

## Overview

This is a full-stack personal finance management application built with React, Express, and Firebase. It allows users to track income and expenses, categorize transactions, and visualize their financial data through an intuitive dashboard interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query for server state, React Context for authentication
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **Build Tool**: Vite for development, esbuild for production builds
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Authentication**: Firebase Authentication
- **Data Storage**: Firebase Firestore (currently implemented), with PostgreSQL schema ready

### Data Storage Solutions
- **Primary Database**: Firebase Firestore for transaction and user data
- **Backup Option**: PostgreSQL with Drizzle ORM schema defined
- **Session Storage**: PostgreSQL sessions with connect-pg-simple (configured but not active)

## Key Components

### Authentication System
- Firebase Authentication for user management
- Protected routes with authentication guards
- Context-based user state management
- Support for email/password authentication with user registration

### Transaction Management
- CRUD operations for financial transactions
- Transaction categorization (income/expense with predefined categories)
- Date-based filtering and sorting
- Form validation with Zod schemas

### Dashboard Features
- Financial overview with income/expense summaries
- Visual charts showing spending patterns over time
- Category-based expense breakdown
- Recent transactions display

### UI Components
- Comprehensive shadcn/ui component library
- Responsive design with mobile-first approach
- Dark/light theme support (configured in CSS variables)
- Toast notifications for user feedback

## Data Flow

1. **User Authentication**: Firebase handles user login/registration
2. **Data Fetching**: React Query manages server state and caching
3. **Data Storage**: Transactions stored in Firestore with user association
4. **Real-time Updates**: Components automatically refresh on data changes
5. **Form Processing**: React Hook Form + Zod validation before submission

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connection (ready for PostgreSQL)
- **firebase**: Authentication and Firestore database
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Database ORM with PostgreSQL support
- **zod**: Schema validation
- **wouter**: Lightweight routing

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **recharts**: Chart library for data visualization
- **lucide-react**: Icon library

## Deployment Strategy

- **Development**: Runs on port 5000 with hot reload via Vite
- **Production Build**: Vite builds frontend, esbuild bundles backend
- **Deployment Target**: Replit autoscale deployment
- **Environment**: Node.js 20 with PostgreSQL 16 module available

The application is configured for easy deployment on Replit with automatic builds and PostgreSQL database provisioning support.

## Changelog

```
Changelog:
- June 23, 2025. Netlify deployment preparation completed
  - Created production build configuration
  - Added Firebase authentication and Firestore integration
  - Fixed SelectItem validation errors
  - Prepared deployment files and documentation
- June 22, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```