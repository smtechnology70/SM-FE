import { Routes, Route } from "react-router-dom";
import "./App.css";
import Index from "./box-open/Index";
import { Ludo } from "./ludo/containers/Ludo/Container";
import Register from "./auth/Register";
import Login from "./auth/Login";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ludo"
        element={
          <ProtectedRoute>
            <Ludo />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
