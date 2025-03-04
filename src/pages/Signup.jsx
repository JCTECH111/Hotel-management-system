import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
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
    setLoading(true);
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
          console.log(response)
      const data = await response.json();

      if (data.success) {
        toast.success("Signup successful!");
        navigate("/login"); // Redirect to login page
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again!");
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }finally{
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
