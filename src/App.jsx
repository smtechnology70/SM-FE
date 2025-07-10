import { Route, Routes } from "react-router";
import "./App.css";
import Index from "./box-open/Index";
import { Ludo } from "./ludo/containers/Ludo/Container";
import Register from "./auth/Register";
import Login from "./auth/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ludo" element={<Ludo />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
