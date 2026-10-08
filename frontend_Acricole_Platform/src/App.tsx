import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;