
# 🚖 Ride Management System – Frontend  

A scalable, production-grade, and fully responsive **ride booking platform** similar to **Uber** or **Pathao**, built with **React**, **Redux Toolkit**, and **RTK Query**.  

[**Live Demo**](https://ride-system-frontend.vercel.app/)  
[**Live Backend**] (https://ride-booking-system-one.vercel.app/)
[**Frontend Code base**] (https://github.com/muhamash/ride-system-frontend.git)
[**Backend Code base**] (https://github.com/muhamash/Ride-Booking-System.git)
---

## 📖 Project Overview  
This project provides a **role-based frontend application** for **Riders**, **Drivers**, and **Admins**.  
It interacts with a backend API to offer ride booking, real-time tracking, user management, analytics, and more, with a polished and intuitive user interface.  

---

## 🚀 Features  

### **Public Features**
- **Home Page** with hero banner, service overview, testimonials, and CTA.
- **About**, **Features**, **FAQ**, and **Contact** pages.
- Fully responsive and visually consistent across devices.

### **Authentication & Authorization**
- JWT-based authentication.
- Role-based dashboards for Rider, Driver, and Admin.
- Persistent session management and logout functionality.
- Account status page for blocked or suspended users.
- Offline mode for drivers.

### **Rider Dashboard**
- Request new rides with fare estimation.
- View and filter ride history.
- Profile management (edit info, change password).
- Optional: Live ride tracking with real-time map integration.

### **Driver Dashboard**
- Availability toggle (Online/Offline).
- Accept or reject ride requests.
- Update ride statuses (Accepted → Picked Up → Completed).
- Earnings dashboard with charts.
- Profile & vehicle details management.

### **Admin Dashboard**
- Manage users (search, filter, block/unblock, approve drivers).
- Advanced ride management with filtering and analytics.
- Data visualizations for ride statistics and revenue trends.

### **Emergency / SOS Button**
- Quick-access button during active rides.
- Options: Call Police, Notify Emergency Contact, Share Live Location.
- Pre-set emergency contact management in user settings.

### **General Enhancements**
- Role-based navigation.
- Skeleton loaders, smooth transitions, and error handling.
- Toast notifications for success/error states.
- Lazy-loading for performance.
- Accessibility-compliant and semantic HTML.

---

## 🛠️ Technology Stack  

### **Frontend**
- [React](https://reactjs.org/) – UI library  
- [React Router](https://reactrouter.com/) – Routing  
- [Redux Toolkit](https://redux-toolkit.js.org/) – State management  
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) – API calls  
- [TypeScript](https://www.typescriptlang.org/) – Type safety  
- [TailwindCSS](https://tailwindcss.com/) – Styling  
- [Shadcn UI](https://ui.shadcn.com/) – UI components  
- [Recharts](https://recharts.org/) – Data visualization  
- [React Hot Toast](https://react-hot-toast.com/) – Notifications  

### **Backend (for integration)**
- Node.js / Express.js  
- MongoDB  
- JWT + bcrypt (authentication & security)  

### **Deployment**
- [Vercel](https://vercel.com/) – Frontend hosting  

---

## ⚙️ Setup Instructions  

### **1. Clone the repository**
```bash
git clone https://github.com/muhamash/ride-system-frontend.git
cd ride-management-frontend
```

### **2. Install dependencies**
```bash
bun install
# or
yarn install
```

### **3. Set up environment variables**
Create a `.env` file in the root directory:
```
VITE_BASE_URL = http://localhost:3000/api
LOCATIONIQTOKEN = LOCATIONIQTOKEN-maps-api-key
```

### **4. Run the development server**
```bash
bun run dev
```
Frontend will run at `http://localhost:5173` or as configured.

### **5. Build for production**
```bash
bun run build
bun start
```

---

## 📂 Project Structure  
```
src/
 ├── components/      # Reusable UI components
 ├── features/        # Redux slices & RTK Query APIs
 ├── pages/           # Page components (Home, Dashboard, etc.)
 ├── routes/          # Role-based routing
 ├── utils/           # Helper functions
 ├── App.tsx          # Main app component
 └── main.tsx         # Entry point
```

---

## 📝 Additional Notes  
- **Lazy-loading** for better performance.  
- **Role-based access** using HOCs & conditional rendering.  
- **Form validation** with clear error messages.  
- **Meaningful commit history** with at least 10 commits.  

---

## 🌐 Live Deployment  
[Live Demo](https://ride-system-frontend.vercel.app/)

---