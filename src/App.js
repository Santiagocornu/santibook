import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import CrearCuenta from "./components/CrearCuenta";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./components/Home";
import { auth } from "./db/firebase";
import { useEffect, useState } from "react";
import LoginEmail from "./components/LoginEmail";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";


  function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return <p>Cargando...</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/crear-cuenta" element={<CrearCuenta />} />
        <Route path="/login-email" element={<LoginEmail />} />

        {/* rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ver-perfil/:uid"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar-perfil/:uid"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EditProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
