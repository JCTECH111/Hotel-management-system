import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    role: "guest",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Toggle Password Visibility
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/signup.php",
        formData, // Axios automatically converts it to JSON
        { headers: { "Content-Type": "application/json" } }
      );
    
      console.log("Full Response:", response);
console.log("Response Data:", response.data);
// console.log("Message:", response.data?.message);

    
      if (response.data?.success) {
        Swal.fire({
          title: response.data.message,
          text: "Success!",
          icon: "success",
          confirmButtonColor: "#4CAF50", // Green button
        });
    
        navigate("/login");
      } else {
        Swal.fire({
          title:  response.data.message || "Signup failed",
          text: "Error!" ,
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Try again!");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="flex justify-center items-center h-auto mt-4 bg-white">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Sign Up</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative mb-4">
          <label className="block text-gray-700 text-md font-bold mb-2">Username</label>
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            value={formData.username} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border-none rounded-lg focus:outline-none   bg-gray-100"
            required 
          />
          </div>

          {/* Email */}
          <div className="relative mb-4">
          <label className="block text-gray-700 text-md font-bold mb-2">Email</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border-none rounded-lg focus:outline-none   bg-gray-100"
            required 
          />
          </div>

          {/* Phone */}
          <div className="relative mb-4">
          <label className="block text-gray-700 text-md font-bold mb-2">Phone Number</label>
          <input 
            type="text" 
            name="phone" 
            placeholder="Phone Number" 
            value={formData.phone} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border-none rounded-lg focus:outline-none   bg-gray-100"
            required 
          />
          <input type="text" hidden name="role" value={formData.role} />
          </div>

          {/* Password */}
          <div className="relative mb-4">
          <label className="block text-gray-700 text-md font-bold mb-2">Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border-none rounded-lg focus:outline-none   bg-gray-100"
              required 
            />
            <button type="button" className="absolute right-3 top-10" onClick={togglePassword}>
              {showPassword ? "👁" : "🙈"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative mb-4">
          <label className="block text-gray-700 text-md font-bold mb-2">Confirm Password</label>
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border-none rounded-lg focus:outline-none   bg-gray-100"
              required 
            />
            <button type="button" className="absolute right-3 top-10" onClick={toggleConfirmPassword}>
              {showConfirmPassword ? "👁" : "🙈"}
            </button>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 " disabled={loading}>
            
            {!loading ? "Register" : "Signing Up..."}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account? <a href="/login" className="text-green-600">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
