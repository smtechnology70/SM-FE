import { Route, Routes } from "react-router";
import "./App.css";
import Index from "./box-open/Index";
import { Ludo } from "./ludo/containers/Ludo/Container";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ludo" element={<Ludo />} />
      </Routes>
    </>
  );
}

export default App;
