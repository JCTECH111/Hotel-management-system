import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./router/routes";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <AuthProvider>
    <ToastContainer position="top-right" autoClose={3000} />
      <AppRoutes />
    </AuthProvider>
  );
}
