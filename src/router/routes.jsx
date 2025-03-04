import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<Signup />} />
        {/* <Route path="/register" element={<Register />} /> */}
        
        {/* Protected Route */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              {/* <Dashboard /> */}
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
