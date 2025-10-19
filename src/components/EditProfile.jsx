// EditProfile.jsx
import React, { useState, useEffect } from "react";
import { auth } from "../db/firebase";
import { updateProfile as fbUpdateProfile } from "firebase/auth"; // <-- modular updateProfile
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
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");

      // Usamos la función modular de firebase/auth
      await fbUpdateProfile(user, {
        displayName: userData.displayName,
        photoURL: userData.photoURL || null,
      });

      // Actualiza en MongoDB usando tu hook
      await editUser({
        uid,
        displayName: userData.displayName,
        email: user.email, 
        photoURL: userData.photoURL,
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

      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="edit-photo-preview">
          <img
            src={
              userData.photoURL ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Preview"
            className="profile-img"
          />
        </div>

        <label>Nombre:</label>
        <input
          type="text"
          name="displayName"
          value={userData.displayName}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />

        <label>URL de imagen:</label>
        <input
          type="text"
          name="photoURL"
          value={userData.photoURL}
          onChange={handleChange}
          placeholder="https://tu-imagen.jpg"
        />

        <button type="submit" className="btn btn-green" style={{ marginTop: "15px" }}>
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default EditProfile;