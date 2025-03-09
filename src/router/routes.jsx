import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
// import Register from "./pages/Register";
import Home from "../pages/employee/pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Overview from "../pages/employee/pages/Overview";
import Rooms from "../pages/employee/pages/Rooms";
import Bookings from "../pages/employee/pages/Bookings";
import ChatPage from "../pages/employee/pages/Messages";
import AddRoom from "../pages/employee/pages/AddRoom";
import ViewRoom from "../pages/employee/pages/ViewRoom";
import RoomBooking from "../pages/employee/pages/CreateBooking";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<Signup />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Protected Route */}
        <Route path="/employee" element={<Home />}>
  <Route index element={<Overview />} />

  <Route path="rooms" element={<Rooms />} />
  <Route path="bookings" element={<Bookings />} />
  <Route path="messages" element={<ChatPage />} />

  {/* Child route should be at the same level as messages */}
  <Route path="messages/chat/:id" element={<ChatPage />} />

  <Route path="add-room" element={<AddRoom />} />
  <Route path="room/:id" element={<ViewRoom />} />
  {/* <Route path="edit-room/:id" element={<EditRoom />} /> */}
  <Route path="room-booking" element={<RoomBooking />} />
</Route>

      <Route
        path="/guest-dashboard"
        element={
          <PrivateRoute>
            {/* <Home /> */}
          </PrivateRoute>
        }
      />
    </Routes>
    </Router >
  );
}
