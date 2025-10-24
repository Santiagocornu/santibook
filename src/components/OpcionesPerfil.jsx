import React, { useState } from "react";
import { auth } from "../db/firebase";
import Swal from "sweetalert2";
import { useDeleteUser } from "../coostomhooks/useDeleteUser";
import { useNavigate } from "react-router-dom";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const OpcionesPerfil = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const { deleteUser } = useDeleteUser();
  const navigate = useNavigate();

  const reauthenticateUser = async (user) => {
    const { value: password } = await Swal.fire({
      title: "Reingresá tu contraseña",
      input: "password",
      inputLabel: "Por seguridad, ingresá tu contraseña para continuar.",
      inputPlaceholder: "Contraseña",
      inputAttributes: { autocapitalize: "off", autocorrect: "off" },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });

    if (!password) throw new Error("Operación cancelada por el usuario.");

    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) {
      Swal.fire("Error", "No hay ningún usuario activo.", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "¿Eliminar cuenta?",
      text: "Esta acción eliminará tu cuenta y todos tus datos permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      Swal.fire({
        title: "Eliminando cuenta...",
        text: "Por favor espera unos segundos.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // 1️⃣ Elimina el usuario de MongoDB
      await deleteUser(user.uid);

      // 2️⃣ Elimina el usuario de Firebase (con reautenticación si hace falta)
      try {
        await user.delete();
      } catch (error) {
        if (error.code === "auth/requires-recent-login") {
          await reauthenticateUser(user);
          await user.delete(); // reintentar luego de reautenticar
        } else {
          throw error;
        }
      }

      Swal.fire(
        "Cuenta eliminada",
        "Tu cuenta fue eliminada exitosamente.",
        "success"
      ).then(() => {
        auth.signOut();
        navigate("/login");
        window.location.reload();
      });
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    const user = auth.currentUser;
    if (user) {
      navigate(`/ver-perfil/${user.uid}`);
    } else {
      navigate("/login");
    }
    onClose();
  };

  const handleConfigAccount = () => {
    const user = auth.currentUser;
    if (user) {
      navigate(`/editar-perfil/${user.uid}`);
      onClose();
    } else {
      Swal.fire("Error", "No hay ningún usuario activo.", "error");
    }
  };

  return (
    <div
      className="profile-dropdown-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.05)",
        zIndex: 2000,
      }}
    >
      <div
        className="profile-dropdown"
        onClick={(e) => e.stopPropagation()}
        style={{ top: "100px" }}
      >
        <button
          className="btn btn-green"
          onClick={handleProfileClick}
          disabled={loading}
        >
          {auth.currentUser ? "Visitar perfil" : "Iniciar sesión"}
        </button>

        <button
          className="btn btn-brown"
          onClick={handleConfigAccount}
          disabled={loading}
        >
          Configurar cuenta
        </button>

        {auth.currentUser && (
          <button
            className="btn btn-red"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar cuenta"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OpcionesPerfil;
