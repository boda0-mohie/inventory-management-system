# Inventory Management System (Backend API)

A backend inventory management system built with NestJS and PostgreSQL.
This project is designed as an MVP to manage products and stock with secure authentication and role-based access control.

The system will evolve into an enterprise-level architecture after the MVP phase.


## Tech Stack

- NestJS
- PostgreSQL
- TypeORM
- JWT Authentication
- Class Validator
- Swagger (for API documentation)
- Docker (future)

## Architecture Overview

The application follows a modular architecture using NestJS best practices.

Main Modules:
- Auth Module
- Users Module
- Products Module

Each module contains:
- Controller (handles HTTP requests)
- Service (business logic)
- DTOs (validation layer)
- Entity (database mapping)

## Project Goals

- Implement clean modular architecture
- Apply authentication and authorization
- Validate all inputs
- Handle business logic properly
- Prepare for scalable enterprise upgrade


## Business Rules (MVP)

- Product quantity cannot be negative.
- Product price must be greater than zero.
- Product name must be unique.
- Only authenticated admins can manage products.

## MVP Features

- Admin authentication (JWT)
- Product CRUD
- Quantity tracking
- Input validation
- Error handling

## Future Improvements

- Categories & Suppliers
- Inventory Transactions
- Role-based access (Admin / Staff)
- Audit logs
- Pagination & Filtering
- Caching
- CI/CD pipeline