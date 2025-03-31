import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/employee/pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Overview from "../pages/employee/pages/Overview";
import Rooms from "../pages/employee/pages/Rooms";
import Bookings from "../pages/employee/pages/Bookings";
import ChatPage from "../pages/employee/pages/Messages";
import AddRoom from "../pages/employee/pages/AddRoom";
import ViewRoom from "../pages/employee/pages/ViewRoom";
import RoomBooking from "../pages/employee/pages/CreateBooking";
import GuestPage from "../pages/employee/pages/Guests";
import Settings from "../pages/employee/pages/Settings";
import NotFound from "../pages/NotFound";
import EditRoom from "../pages/employee/pages/EditRoom";
import RoomDetails from "../pages/employee/pages/RoomDetails";
// import ManagerDashboard from "../pages/manager/pages/Dashboard"; // Add manager dashboard
// import HousekeeperDashboard from "../pages/housekeeper/pages/Dashboard"; // Add housekeeper dashboard
import GuestDashboard from "../pages/guest/pages/Dashboard";
import GuestRooms from "../pages/guest/pages/Rooms";
import GuestViewRoom from "../pages/guest/pages/GuestViewRoom";
import BookingSuccess from "../pages/guest/pages/BookingSuccess";
import GuestBooked from "../pages/guest/pages/GuestBooked";
import ContactUs from "../pages/guest/pages/ContactUs";
import GuestSettings from "../pages/guest/pages/Settings";
import Unauthorized from "../pages/Unauthorized"; // Add unauthorized page

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/employee"
          element={
            <PrivateRoute allowedRoles={["employee"]}>
              <Home />
            </PrivateRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="messages" element={<ChatPage />} />
          <Route path="guests" element={<GuestPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="messages/chat/:id" element={<ChatPage />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="room/:id" element={<ViewRoom />} />
          <Route path="room-details/:id" element={<RoomDetails />} />
          <Route path="edit-room/:id" element={<EditRoom />} />
          <Route path="room-booking" element={<RoomBooking />} />
        </Route>

        {/* Guest Dashboard (Protected) */}
        <Route
          path="/guest-dashboard"
          element={
            <PrivateRoute allowedRoles={["guest"]}>
              <GuestDashboard />
            </PrivateRoute>
          }
        >
             <Route path="all-rooms" element={<GuestRooms />} />
             <Route path="all-rooms/:id" element={<GuestViewRoom />} />
             <Route path="booking-success" element={<BookingSuccess />} />
             <Route path="booking-history/:id" element={<GuestBooked />} />
             <Route path="room-details/:id" element={<RoomDetails />} />
             <Route path="contact" element={<ContactUs />} />
             <Route path="settings" element={<GuestSettings />} />
        </Route>

        {/* Manager Dashboard (Protected) */}
        <Route
          path="/manager-dashboard"
          element={
            <PrivateRoute allowedRoles={["manager"]}>
              {/* <ManagerDashboard /> */}
            </PrivateRoute>
          }
        />

        {/* Housekeeper Dashboard (Protected) */}
        <Route
          path="/housekeeper-dashboard"
          element={
            <PrivateRoute allowedRoles={["housekeeper"]}>
              {/* <HousekeeperDashboard /> */}
            </PrivateRoute>
          }
        />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}