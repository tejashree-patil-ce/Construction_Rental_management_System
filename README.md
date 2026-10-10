# Maya Centring Plates – Construction Rental Management System

A MERN-stack web app that manages the rental of construction materials
(centring plates, column plates): customers, inventory, rentals with live
billing, returns, invoices and a public customer portal.

**Live demo:** <your Vercel URL>

## Features
- Admin login (JWT, bcrypt-hashed passwords)
- Customer and inventory management
- Start / return rentals with atomic stock updates
- Live ticking rental duration and bill (billed days = ceil, minimum 1 day)
- Rental history and printable invoices
- Public customer portal (lookup by phone number, rate limited)
- Zod validation and standardized error responses

## Tech stack
React, React Router, axios, Node.js, Express, MongoDB, Mongoose,
JWT, bcryptjs, Zod, helmet, express-rate-limit

## Run locally
1. `cd backend`, `npm install`, create `.env` (see below), `npm run seed:admin`, `npm run dev`
2. `cd frontend`, `npm install`, create `.env`, `npm run dev`

Backend `.env`: PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, CLIENT_URL,
ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
Frontend `.env`: VITE_API_URL
