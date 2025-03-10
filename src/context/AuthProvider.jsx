import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext"; // Import the Context

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDataString = localStorage.getItem("user");
  
    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString); // Attempt to parse JSON
        fetch("http://localhost:8000/validate_token.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setUser(userData);
            } else {
              logout();
            }
          })
          .catch(() => logout())
          .finally(() => setLoading(false));
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        logout(); // Clear invalid data
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}