import { Route, Routes } from "react-router";
import "./App.css";
import ZeroBlast from "./box-open/Index";
import SingleBox from "./single-open/Index";
import { Ludo } from "./ludo/containers/Ludo/Container";
import Register from "./auth/Register";
import Login from "./auth/Login";
import { SingleGameProvider } from "./single-open/contexts/singleGameContext";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ZeroBlast />} />
        <Route path="/ludo" element={<Ludo />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/single"
          element={
            <SingleGameProvider>
              <SingleBox />
            </SingleGameProvider>
          }
        />
      </Routes>
    </>
  );
}

export default App;
