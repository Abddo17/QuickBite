# QuickBite 🍕

A modern full-stack food ordering and delivery platform built with Laravel and React.

[![Laravel](https://img.shields.io/badge/Laravel-12.x-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org)
[![PHP](https://img.shields.io/badge/PHP-8.2+-purple.svg)](https://php.net)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

-   [About](#about)
-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Usage](#usage)
-   [API Documentation](#api-documentation)
-   [Contributing](#contributing)
-   [License](#license)

## 🚀 About

QuickBite is a comprehensive food ordering platform that connects customers with restaurants for seamless food delivery and pickup services. Built with modern web technologies, it provides a smooth user experience for both customers and restaurant owners.

## ✨ Features

-   **User Authentication & Authorization** - Secure login/registration with Laravel Sanctum
-   **Restaurant Management** - Complete CRUD operations for restaurant profiles
-   **Menu Management** - Dynamic menu creation and management
-   **Order Processing** - Real-time order tracking and status updates
-   **Payment Integration** - Secure payment processing with Stripe
-   **Responsive Design** - Mobile-first approach with Tailwind CSS
-   **Real-time Updates** - Live order status and notifications
-   **Admin Dashboard** - Comprehensive admin panel for restaurant management

## 🛠 Tech Stack

### Backend

-   **Laravel 12** - PHP web framework
-   **Laravel Sanctum** - API authentication
-   **MySQL/PostgreSQL** - Database
-   **Stripe** - Payment processing
-   **PHPUnit** - Testing framework

### Frontend

-   **React 19** - JavaScript library for building user interfaces
-   **Vite** - Build tool and development server
-   **Redux Toolkit** - State management
-   **React Router** - Client-side routing
-   **Tailwind CSS** - Utility-first CSS framework
-   **GSAP** - Animation library
-   **Axios** - HTTP client

### Development Tools

-   **ESLint** - Code linting
-   **Laravel Pint** - PHP code style fixer
-   **Scribe** - API documentation generator

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

-   **PHP 8.2+**
-   **Composer**
-   **Node.js 18+**
-   **npm** or **yarn**
-   **MySQL** or **PostgreSQL**
-   **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/QuickBite.git
cd QuickBite
```

### 2. Backend Setup

```bash
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env file
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=quickbite
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run database migrations
php artisan migrate

# Seed the database (optional)
php artisan db:seed

# Install Laravel Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Generate API documentation
php artisan scribe:generate
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd FrontEnd

# Install Node.js dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your API endpoint in .env
# VITE_API_URL=http://localhost:8000/api
```

### 4. Environment Configuration

Update your `.env` file with the following configurations:

```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=quickbite
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Stripe Configuration
STRIPE_KEY=your_stripe_publishable_key
STRIPE_SECRET=your_stripe_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 🎯 Usage

### Development Mode

1. **Start the Backend Server:**

    ```bash
    php artisan serve
    ```

    The API will be available at `http://localhost:8000`

2. **Start the Frontend Development Server:**

    ```bash
    cd FrontEnd
    npm run dev
    ```

    The frontend will be available at `http://localhost:3000`

3. **Run Both Simultaneously:**
    ```bash
    composer run dev
    ```

### Production Build

1. **Build the Frontend:**

    ```bash
    cd FrontEnd
    npm run build
    ```

2. **Optimize Laravel:**
    ```bash
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

## 📚 API Documentation

API documentation is automatically generated using Scribe and is available at:

-   **Development:** `http://localhost:8000/docs`
-   **Production:** `https://your-domain.com/docs`

## 🧪 Testing

### Backend Tests

```bash
php artisan test
```

### Frontend Tests

```bash
cd FrontEnd
npm run test
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

-   Follow PSR-12 for PHP code
-   Use Laravel Pint for PHP code formatting
-   Follow ESLint rules for JavaScript/React code

## 📄 License

This project is licensed under the MIT License .

## 🙏 Acknowledgments

-   [Laravel](https://laravel.com) - The PHP framework for web artisans
-   [React](https://reactjs.org) - A JavaScript library for building user interfaces
-   [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework
-   [Stripe](https://stripe.com) - Payment processing platform
