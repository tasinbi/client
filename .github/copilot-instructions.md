# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a full-stack blog website built with React, Node.js, MySQL, and Bootstrap. The project includes:

### Frontend (React)

- Bootstrap 5 for responsive design
- CKEditor 5 for rich text editing
- React Router for navigation
- Axios for API calls
- Context API for state management

### Backend (Node.js/Express)

- JWT authentication for admin
- MySQL database with mysql2
- Multer for file uploads
- Express validator for input validation
- CORS enabled

### Key Features

- Admin authentication system
- Blog CRUD operations
- Category management
- File upload (images/videos)
- Rich text editing with CKEditor
- Responsive design
- Bengali language support

## Code Style Guidelines

- Use Bengali comments and text for user-facing content
- Follow React functional components with hooks
- Use async/await for API calls
- Implement proper error handling
- Use Bootstrap classes for styling
- Follow RESTful API conventions

## Database Schema

- `admins` table for admin authentication
- `categories` table for blog categories
- `blogs` table for blog posts with foreign key to categories

## Important Notes

- All admin routes require JWT authentication
- File uploads are handled by Multer
- CKEditor is used for rich text content
- Bengali language is used for UI text
- Bootstrap provides responsive design
