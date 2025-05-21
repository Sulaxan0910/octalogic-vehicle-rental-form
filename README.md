# Vehicle Rental Booking System

A modern web application for vehicle rental bookings with a step-by-step form interface. Users can select vehicles based on their preferences and book them for specific date ranges.

## Features

- Multi-step form interface
- Dynamic vehicle type and model selection
- Date range booking
- Form validation
- Modern Material-UI components

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Project Structure

```
octalogic-vehicle-rental-form/
├── frontend/           # React frontend application
│   ├── src/           # Source files
│   └── package.json   # Frontend dependencies
└── backend/           # Backend server (API)
    └── package.json   # Backend dependencies
```

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following content:
   ```
   VITE_API_URL=http://localhost:5000
   ```
   > Replace `5000` with your actual port configured for the backend.

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with your database configuration:
   ```
   DATABASE_URL="mysql://root:your_password@localhost:3306/vehicle_rental"
   PORT="5000"
   ```

```

> Replace `root`, `your_password`, and `vehicle_rental` with your actual MySQL credentials and database name.
```

## 🧱 Prisma Setup

### 1. Initialize & Migrate the Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### 2. Seed the Database

```bash
npm run seed
```

> This seeds some vehicle types and sample vehicles.

---

## Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

   The server will start on http://localhost:5000

2. In a new terminal, start the frontend application:
   ```bash
   cd frontend
   npm run dev
   ```
   The application will open in your default browser at http://localhost:5173

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/vehicle-types?wheels={wheels}` - Get vehicle types based on number of wheels
- `GET /api/vehicles/{vehicleType}` - Get vehicles for a specific vehicle type
- `POST /api/book` - Create a new booking

## Dependencies

### Frontend

- React
- Material-UI (@mui/material)
- Material-UI Date Pickers (@mui/x-date-pickers)
- date-fns
- axios

### Backend

- Express.js
- Other backend dependencies (as per your backend setup)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
