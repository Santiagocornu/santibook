// EditProfile.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../db/firebase";
import { updateProfile as fbUpdateProfile } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useEditUser } from "../coostomhooks/useEditUser";
import "../styles/Profile.css";

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
    // Limitar caracteres
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
      <div className="profile-center">
        <div className="loader"></div>
      </div>
    );

  return (
    <div className="profile-container">
      <button className="btn-back-home btn-brown" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <h2 style={{ textAlign: "center", margin: "20px 0" }}>Editar Perfil</h2>

      <form className="edit-profile-form" onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
  <div className="edit-photo-preview" style={{ textAlign: "center", marginBottom: "20px" }}>
    <img
      src={userData.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
      alt="Preview"
      className="profile-img"
      style={{ borderRadius: "50%", width: "100px", height: "100px" }}
    />
  </div>

  <label style={{ display: "block", margin: "15px 0 5px" }}>Nombre:</label>
  <input
    type="text"
    name="displayName"
    value={userData.displayName}
    onChange={handleChange}
    placeholder="Nombre"
    required
    maxLength={30}
    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
  />

  <label style={{ display: "block", margin: "15px 0 5px" }}>URL de imagen:</label>
  <input
    type="text"
    name="photoURL"
    value={userData.photoURL}
    onChange={handleChange}
    placeholder="https://tu-imagen.jpg"
    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
  />

  <label style={{ display: "block", margin: "15px 0 5px" }}>Bio:</label>
  <input
    name="bio"
    value={userData.bio}
    onChange={handleChange}
    placeholder="Escribe una breve descripción sobre ti..."
    rows={4}
    maxLength={255}
    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", resize: "none" }}
  />

  <div style={{ textAlign: "center", marginTop: "25px" }}>
    <button
      type="submit"
      className="btn btn-green"
      style={{ padding: "10px 30px", borderRadius: "25px", cursor: "pointer" }}
    >
      Guardar cambios
    </button>
  </div>
</form>

    </div>
  );
};

export default EditProfile;
