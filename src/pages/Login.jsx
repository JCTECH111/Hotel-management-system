import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
 const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:8000/signin.php", { email, pin });
       console.log(data)
       if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        
        switch (data.user.role) {
            case "guest":
                navigate("/guest-dashboard");
                break;
            case "employee":
                navigate("/employee");
                break;
            case "housekeeper":
                navigate("/housekeeper-dashboard");
                break;
            case "manager":
                navigate("/manager-dashboard");
                break;
            default:
                navigate("/dashboard"); // Default route
        }
    } else {
        toast.error("Invalid credentials");
        console.log(data.message || "Login failed.");
    }
    
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed", error);
    }finally{
       setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Login</h2>
        
        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Email Address</label>
          <input
            type="email"
            className="w-full px-4 py-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PIN Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Pin</label>
          <input
            type="password"
            className="w-full px-4 py-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100"
            placeholder="Enter your 4-digit pin"
            onChange={(e) => setPin(e.target.value)}
          />
        </div>

        {/* Forgot Pin */}
        <div className="text-right text-sm text-green-500 cursor-pointer mb-4">
          Forgot Pin?
        </div>

        {/* Login Button */}
        <button
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
          onClick={handleLogin}
          disabled={loading}
        >
        {!loading ? "Login" : "Logging In..."}
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account? <Link to="/signUp"><span className="text-green-500 cursor-pointer">Sign Up</span></Link>
        </p>
      </div>
    </div>
  );
}
