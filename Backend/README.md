
# 🚗 Vehicle Rental Backend

This is the backend API for a Vehicle Rental Booking system, built with **Node.js**, **Express**, **Prisma ORM**, and **MySQL**.

---

## 📦 Tech Stack

- Node.js
- Express.js
- Prisma ORM
- MySQL
- dotenv
- CORS
- Nodemon (dev)
- Body-parser

---

## 📁 Project Structure

```
vehicle-rental-backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/vehicle-rental-backend.git
cd vehicle-rental-backend
```

### 2. Install Dependencies

```bash
npm install
```

---

## ⚙️ Environment Setup

### 3. Configure `.env`

Create a `.env` file in the root:

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/vehicle_rental"
```

> Replace `root`, `your_password`, and `vehicle_rental` with your actual MySQL credentials and database name.

---

## 🧱 Prisma Setup

### 4. Initialize & Migrate the Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### 5. Seed the Database

```bash
npm run seed
```

> This seeds some vehicle types and sample vehicles.

---

## 🔌 Running the Server

### 6. Development Mode

```bash
npm run dev
```

> Server will start on `http://localhost:5000`

### 7. Production Mode

```bash
npm start
```

---

## 📮 API Endpoints

### Base URL: `/api`

| Method | Endpoint                  | Description                                |
|--------|---------------------------|--------------------------------------------|
| GET    | `/vehicle-types?wheels=4` | Get vehicle types filtered by wheels (2/4) |
| GET    | `/vehicles/:typeId`       | Get vehicles by vehicle type ID            |
| POST   | `/book`                   | Book a vehicle with user details & dates   |

---

## 📑 Scripts

```json
"scripts": {
  "dev": "nodemon src/server.js",
  "start": "node src/server.js",
  "seed": "node prisma/seed.js"
}
```

---

## 🛠 Dev Notes

- Uses `Prisma ORM` for database interaction.
- Seed script includes vehicle types and sample vehicles.
- Validates overlapping bookings to avoid double-booking.

---


## 🤝 Contributing

Feel free to open issues or submit pull requests if you'd like to improve this project.

---

## 📃 License

MIT
