import { MemoryRouter, Routes, Route } from "react-router-dom"; // Cambia BrowserRouter por MemoryRouter
import Login from "./components/Login";
import CrearCuenta from "./components/CrearCuenta";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./components/Home";
import { auth } from "./db/firebase";
import { useEffect, useState } from "react";
import LoginEmail from "./components/LoginEmail";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Chats from "./components/ChatComponents/Chats";
import ShowChat from "./components/ChatComponents/ShowChat";

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

  if (checkingAuth) return <p>Cargando...</p>;

  return (
    <MemoryRouter> 
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/crear-cuenta" element={<CrearCuenta />} />
        <Route path="/login-email" element={<LoginEmail />} />

        {/* Protegidas */}
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
        <Route
          path="/chats"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Chats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:_id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ShowChat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

export default App;
