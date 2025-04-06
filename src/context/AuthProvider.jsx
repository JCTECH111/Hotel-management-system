import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext"; // Import the Context

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const tokens = localStorage.getItem("token");
    const userDataString = localStorage.getItem("user");
  
    if (tokens && userDataString) {
      try {
        const userData = JSON.parse(userDataString); // Attempt to parse JSON
        fetch("http://localhost:8000/validate_token.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tokens }),
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
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}