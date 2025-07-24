import "./App.css";
import ZeroBlast from "./box-open/Index";
import SingleBox from "./single-open/Index";
import { Ludo } from "./ludo/containers/Ludo/Container";
import Register from "./auth/Register";
import Login from "./auth/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import { SingleGameProvider } from "./single-open/contexts/singleGameContext";
import { Navigate, Route, Routes } from "react-router";
import DailyLottery from "./lottery/DailyLottery";
import DailyDigitGame from "./minimumNumberCount/DailyDigitGame";
// import Header from "./lottery/Header";

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
          <ProtectedRoute>
            <SingleGameProvider>
              <SingleBox />
            </SingleGameProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lottery"
        element={
          <ProtectedRoute>
            {/* <Header /> */}
            <DailyLottery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            {/* <Header /> */}
            <DailyLottery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dailyDigitGame"
        element={
          <ProtectedRoute>
            <DailyDigitGame />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
