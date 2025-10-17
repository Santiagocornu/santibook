import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/globalStyles.css"; 
import "../styles/LoginStyles.css";
import { auth, googleProvider, facebookProvider } from "../db/firebase";
import { signInWithPopup, signInAnonymously } from "firebase/auth";
import Swal from "sweetalert2";

// Importar iconos de react-icons
import { FaFacebookF, FaGoogle, FaEnvelope } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      Swal.fire("¡Éxito!", "Has iniciado sesión con Google", "success").then(() => {
        navigate("/"); 
      });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      Swal.fire("¡Éxito!", "Has iniciado sesión con Facebook", "success").then(() => {
        navigate("/"); 
      });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
      Swal.fire("¡Éxito!", "Has ingresado como invitado", "success").then(() => {
        navigate("/");
      });
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
