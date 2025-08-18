import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Dashboard (TBD)</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
