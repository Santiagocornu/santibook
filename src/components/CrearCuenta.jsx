import React, { useState } from "react";
import "../styles/globalStyles.css";
import "../styles/LoginStyles.css"; // 👈 Usa los mismos estilos
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth } from "../db/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const CrearCuenta = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (displayName.trim() !== "") {
        await updateProfile(user, { displayName });
      }

      await fetch("/.netlify/functions/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: displayName || null,
          photoURL: null,
          type: "user",
          createdAt: new Date(),
        }),
      });

      Swal.fire({
        title: "¡Cuenta creada!",
        text: `Bienvenido ${displayName || user.email}`,
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => navigate("/"));
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">
        <h2>Crear Cuenta</h2>

        {/* Apodo */}
        <input
          type="text"
          placeholder="Apodo"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

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

        {/* Confirmar contraseña con botón dentro */}
        <div className="password-input-container">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Botones lado a lado */}
        <div className="btn-row-login">
          <button className="btn btn-green" type="submit">
            Crear cuenta
          </button>

          <Link
            to="/"
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

export default CrearCuenta;
