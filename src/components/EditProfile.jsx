// EditProfile.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../db/firebase";
import { updateProfile as fbUpdateProfile } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useEditUser } from "../coostomhooks/useEditUser";

const EditProfile = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { editUser, loading: loadingEdit } = useEditUser();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    displayName: "",
    photoURL: "",
    bio: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser || currentUser.uid !== uid) {
          Swal.fire("Error", "No tienes permiso para editar este perfil", "error");
          navigate("/");
          return;
        }

        setUserData({
          displayName: currentUser.displayName || "",
          photoURL: currentUser.photoURL || "",
          bio: "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [uid, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "displayName" && value.length > 30) return;
    if (name === "bio" && value.length > 255) return;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");

      await fbUpdateProfile(user, {
        displayName: userData.displayName,
        photoURL: userData.photoURL || null,
      });

      await editUser({
        uid,
        displayName: userData.displayName,
        email: user.email,
        photoURL: userData.photoURL,
        bio: userData.bio,
      });

      Swal.fire("Perfil actualizado", "", "success");
      navigate(`/ver-perfil/${uid}`);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Error al actualizar", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingEdit)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <div
          className="spinner"
          style={{ width: "80px", height: "80px", borderColor: "#8e6e53" }}
        ></div>
      </div>
    );

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "#f5f3f0",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "15px",
          left: "15px",
          backgroundColor: "#8e6e53",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ← Volver
      </button>

      <h2
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#4a3b2a",
        }}
      >
        Editar Perfil
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        {/* Imagen */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={
              userData.photoURL ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Preview"
            style={{
              borderRadius: "50%",
              width: "100px",
              height: "100px",
              objectFit: "cover",
              boxShadow: "0 0 6px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        {/* Nombre */}
        <label style={{ marginBottom: "5px", color: "#4a3b2a", fontWeight: "bold" }}>
          Nombre:
        </label>
        <input
          type="text"
          name="displayName"
          value={userData.displayName}
          onChange={handleChange}
          placeholder="Nombre"
          required
          maxLength={30}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "15px",
          }}
        />

        {/* Imagen */}
        <label style={{ marginBottom: "5px", color: "#4a3b2a", fontWeight: "bold" }}>
          URL de imagen:
        </label>
        <input
          type="text"
          name="photoURL"
          value={userData.photoURL}
          onChange={handleChange}
          placeholder="https://tu-imagen.jpg"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "15px",
          }}
        />

        {/* Bio */}
        <label style={{ marginBottom: "5px", color: "#4a3b2a", fontWeight: "bold" }}>
          Bio:
        </label>
        <textarea
          name="bio"
          value={userData.bio}
          onChange={handleChange}
          placeholder="Escribe una breve descripción sobre ti..."
          rows={4}
          maxLength={255}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            resize: "none",
            marginBottom: "20px",
          }}
        />

        {/* Botón guardar */}
        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            disabled={loadingEdit}
            style={{
              backgroundColor: "#8e6e53",
              color: "white",
              border: "none",
              padding: "10px 30px",
              borderRadius: "25px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#725840")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#8e6e53")}
          >
            {loadingEdit ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
