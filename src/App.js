import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import CrearCuenta from "./components/CrearCuenta";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./components/Home";
import { auth } from "./db/firebase";
import { useEffect, useState } from "react";
import LoginEmail from "./components/LoginEmail";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Escucha cambios de autenticación en Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/crear-cuenta" element={<CrearCuenta />} />
        <Route path="/login-email" element={<LoginEmail/>}/> 
        {/* Ruta protegida */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
