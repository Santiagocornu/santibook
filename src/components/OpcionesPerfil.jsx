import React, { useState } from "react";
import { auth } from "../db/firebase";
import Swal from "sweetalert2";
import { useDeleteUser } from "../coostomhooks/useDeleteUser";

const OpcionesPerfil = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const { deleteUser } = useDeleteUser();

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

      // 1️⃣ Eliminar usuario de MongoDB Atlas
      await deleteUser(user.uid);

      // 2️⃣ Eliminar cuenta de Firebase Auth
      await user.delete();

      Swal.fire("Cuenta eliminada", "Tu cuenta fue eliminada exitosamente.", "success").then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.05)", // sombra muy leve
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "260px",
          height: "100%",
          backgroundColor: "#f5f5f5",
          borderRadius: "0 15px 15px 0",
          boxShadow: "2px 0 8px rgba(0,0,0,0.12)", // sombra muy suave
          display: "flex",
          flexDirection: "column",
          padding: "25px",
          textAlign: "center",
          animation: "slideLeft 0.3s ease",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Opciones de perfil</h2>
        <button
          className="btn btn-green"
          style={{ width: "100%", marginBottom: "10px" }}
          onClick={() => Swal.fire("Proximamente", "Visitar perfil aún no implementado", "info")}
          disabled={loading}
        >
          Visitar perfil
        </button>
        <button
          className="btn btn-brown"
          style={{ width: "100%", marginBottom: "10px" }}
          onClick={() => Swal.fire("Proximamente", "Configuración aún no implementada", "info")}
          disabled={loading}
        >
          Configurar cuenta
        </button>
        <button
          className="btn btn-red"
          style={{ width: "100%" }}
          onClick={handleDeleteAccount}
          disabled={loading}
        >
          {loading ? "Eliminando..." : "Eliminar cuenta"}
        </button>
      </div>

      {/* Animación */}
      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default OpcionesPerfil;
