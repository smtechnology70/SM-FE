import "./App.css";
import ZeroBlast from "./box-open/Index";
import SingleBox from "./single-open/Index";
import { Ludo } from "./ludo/containers/Ludo/Container";
import Register from "./auth/Register";
import Login from "./auth/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import { SingleGameProvider } from "./single-open/contexts/singleGameContext";
import { Route, Routes } from "react-router";

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
            <ZeroBlast />
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
      <Route
        path="/single"
        element={
          <SingleGameProvider>
            <SingleBox />
          </SingleGameProvider>
        }
      />
    </Routes>
  );
}

export default App;
