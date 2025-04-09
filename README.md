# 🏨 Hotel Management System

![Hotel Management Dashboard](https://via.placeholder.com/1200x600?text=Hotel+Dashboard+Preview)

A **full-stack web application** for managing hotel operations, bookings, staff, and guest services with role-based access control.

---

## 🌟 Key Features
### 🔐 Authentication & Roles
![Login Page](./readme_img/login.png)
- Secure JWT authentication for:
  - 🧑‍💼 **Admin** (Full access)
  - 🧹 **Housekeeping** (Room status updates)
  - 🏨 **Reception** (Bookings/check-ins)
  - 👨‍👩‍👦 **Guests** (Booking portal)

### 🛏️ Room Management
![Room Management](./readme_img/staffs-room.png)
![Room INFO](./readme_img/about-room.png)
- Add/edit rooms with:t
  - 📸 Multiple images
  - 🛁 Amenities (WiFi, AC, Mini-bar)
  - 📊 Real-time availability calendar

### 📅 Booking System
![Booking Interface](./readme_img/staff-booking-room.png)
- Online reservations with:
  - 🗓️ Date selection
  - 👥 Guest count
  - 💳 Secure payment gateway

### 🧹 Housekeeping
![Housekeeping Dashboard](./readme_img/hk-room_status.png)
- Room status tracking:
  - 🟢 Clean
  - 🟠 Occupied
  - 🔴 Maintenance

### 💰 Payments & Invoices
![Invoice](./readme_img/receipt.png)
- Multiple payment methods:
  - 💵 Cash
  - 💳 Cards (Stripe integration)
  - 📲 Mobile payments

---

## 🛠 Tech Stack
| Layer        | Technologies                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **Frontend** | React 18 • TailwindCSS • Redux • React Router • Vite                        |
| **Backend**  | PHP 8.2 • MySQL • JWT Authentication                                       |
| **DevOps**   | Docker • GitHub Actions                                                    |

---

## 🚀 Installation
```bash
# Clone repository
git clone https://github.com/your-repo/hotel-management-system.git
cd hotel-management-system

# Install dependencies
npm install

# Start development server
npm run dev