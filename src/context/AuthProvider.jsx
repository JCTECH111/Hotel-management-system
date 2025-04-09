import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoized login/logout to prevent unnecessary re-renders
  const login = useCallback((newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  }, []);

  // Validate token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      setLoading(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch("http://localhost:8000/validate_token.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: storedToken }),
        });
        const data = await response.json();

        if (data.success) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          logout(); // Clear invalid token
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        logout(); // Clear on error
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}