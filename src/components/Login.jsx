import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/LoginStyles.css";
import "../styles/globalStyles.css"; 

import { auth, googleProvider, facebookProvider } from "../db/firebase";
import { signInWithPopup, signInAnonymously } from "firebase/auth";
import Swal from "sweetalert2";

// Importar iconos de react-icons
import { FaFacebookF, FaGoogle, FaEnvelope } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  // Función genérica para login social y creación de user en Mongo
  const handleSocialLogin = async (provider, providerName) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Crear usuario en MongoDB si no existe, usando datos de Firebase
      await fetch("/.netlify/functions/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email || null,  
          displayName: user.displayName || null, 
          photoURL: user.photoURL || null, 
          type: "user",
          createdAt: new Date(),
        }),
      });

      // Navegar a home después de login exitoso
      
        navigate("/");
     
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleGoogleLogin = () => handleSocialLogin(googleProvider, "Google");
  const handleFacebookLogin = () => handleSocialLogin(facebookProvider, "Facebook");

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
      
        navigate("/");
    
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="form-container">
      <form className="form-card">
        <h2>Iniciar Sesión</h2>

        {/* Fila 1: Facebook, Google, Crear cuenta Email */}
        <div className="btn-row">
          <button type="button" className="btn btn-blue" onClick={handleFacebookLogin}>
            <FaFacebookF style={{ marginRight: "8px" }} />
            Facebook
          </button>
          <button type="button" className="btn btn-red-google" onClick={handleGoogleLogin}>
            <FaGoogle style={{ marginRight: "8px" }} /> 
            Google
          </button>
          <Link to="/login-email" className="btn btn-brown" style={{ textDecoration: "none", textAlign: "center" }}>
            <FaEnvelope style={{ marginRight: "8px" }} />
            Email
          </Link>
        </div>

        {/* Fila 2: Invitado */}
        <button type="button" className="btn btn-brown" onClick={handleGuestLogin}>
          Ingresar como invitado
        </button>

        {/* Fila 3: Cancelar y Crear cuenta lado a lado */}
        <div className="btn-row">
          <Link to="/" className="btn btn-red" style={{ textDecoration: "none", textAlign: "center" }}>
            Cancelar
          </Link>
          <Link to="/crear-cuenta" className="btn btn-green" style={{ textDecoration: "none", textAlign: "center" }}>
            Crear cuenta
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;