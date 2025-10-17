import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/globalStyles.css";
import "../styles/LoginStyles.css";
import { auth } from "../db/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

const LoginEmail = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">
        <h2>Iniciar sesión con Email</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Contraseña con botón dentro */}
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Botones lado a lado */}
        <div className="btn-row-login">
          <button className="btn btn-green" type="submit">
            Iniciar sesión
          </button>

          <Link
            to="/login"
            className="btn btn-red"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginEmail;
