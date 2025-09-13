# Fitness Tracker Mobile App

## Overview

This is a comprehensive mobile-first fitness tracking application built with React/TypeScript frontend and Express.js backend. The app provides workout logging, nutrition tracking, progress monitoring, and AI-powered coaching features. It uses an offline-first approach with localStorage for data persistence and includes integration with Google's Gemini AI for intelligent coaching and recipe generation.

## Recent Changes

### Daily Diary Dashboard Redesign (Phase 1 - December 2024)
- **Redesigned Home Screen**: Completely reimplemented the home page as a "Daily Diary" dashboard with dark theme design
- **Interactive Elements**: Added time-based greeting system, live clock updates, and 5-emoji mood check-in functionality
- **Action Cards**: Large purple-to-pink gradient cards for quick access to workout and meal logging
- **Progress Tracking**: Visual progress indicators for daily steps, calories burned, and sleep hours with proper clamping
- **Mobile-First UX**: Single-column responsive layout optimized for touch interaction with generous spacing
- **Accessibility**: Added aria-labels, test IDs, and proper keyboard navigation support

### Nutrition Log Redesign (Phase 2 - December 2024)
- **Search-First Interface**: Transformed tab-based nutrition page to lead with prominent search bar for frictionless food logging
- **Open Food Facts Integration**: Connected to 2.9+ million food products database with comprehensive nutritional information
- **Enhanced UX**: Added loading states, empty states, and mobile-optimized food selection modal with servings controls
- **API Attribution**: Proper Open Food Facts attribution with ODbL license compliance for commercial use
- **Preserved Features**: Maintained custom food entry, recent foods history, and barcode input while improving interface hierarchy
- **Complete Workflow**: Full search → selection → logging workflow tested and verified for seamless user experience
- **Barcode Scanning**: Integrated react-zxing library for real-time camera barcode scanning with automatic Open Food Facts lookup
- **Mobile Camera Support**: Optimized camera interface for mobile devices with proper permissions and video attributes
- **Robust Error Handling**: Comprehensive camera access, device detection, and network error management

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and React hooks for local state
- **Mobile-First Design**: Responsive layout optimized for mobile devices with bottom navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework using ESM modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive database schema covering users, exercises, workouts, meals, and AI conversations
- **API Design**: RESTful endpoints with JSON request/response format

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database (serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions and migrations
- **Offline Storage**: localStorage-based persistence layer for offline-first functionality
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple

### Authentication and Authorization
- **Session-based Authentication**: Express sessions with PostgreSQL storage
- **User Management**: Simple username/password authentication system
- **Demo User**: Default demo user setup for development and testing

### UI/UX Architecture
- **Component System**: Modular component architecture with reusable UI primitives
- **Theme System**: Dark/light mode support with CSS custom properties
- **Mobile Navigation**: Bottom tab navigation pattern for mobile-first experience
- **Form Handling**: React Hook Form with Zod schema validation

### Data Models
- **Users**: Profile information, fitness goals, activity levels
- **Exercises**: Comprehensive exercise database with categories and instructions
- **Workouts**: Session tracking with sets, reps, weights, and RIR (Reps in Reserve)
- **Nutrition**: Meal logging with macro tracking and goal setting
- **Progress Tracking**: Body metrics and workout performance over time

## External Dependencies

### AI Services
- **Google Gemini AI**: Integrated for workout analysis, nutrition advice, recipe generation, and chat-based coaching
- **API Key Required**: GEMINI_API_KEY environment variable

### Database Services
- **Neon Database**: Serverless PostgreSQL database
- **Connection**: DATABASE_URL environment variable required

### Development Tools
- **Replit Integration**: Vite plugin for Replit development environment
- **Error Handling**: Runtime error overlay for development debugging

### UI Dependencies
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **Date-fns**: Date manipulation and formatting utilities

### Build and Development
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins