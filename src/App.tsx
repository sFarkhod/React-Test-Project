import "./App.css";
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// importing components
const Register = lazy(() => import("./components/Register"));
const NotFound = lazy(() => import("./components/NotFound"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const MySelf = lazy(() => import("./components/MySelf"));

function App() {
  return (
    <main className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myself"
          element={
            <ProtectedRoute>
              <MySelf />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
