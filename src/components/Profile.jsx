import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../db/firebase";
import Posts from "./Posts";
import { useUser } from "../coostomhooks/useUsers";
import "../styles/Profile.css";

const Profile = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useUser(uid); 
  const [currentUid, setCurrentUid] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) setCurrentUid(currentUser.uid);
  }, []);

  const isOwnProfile = currentUid === uid;

  if (loading) {
    return (
      <div className="profile-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) { return (
      <div className="profile-center">
        <h2 className="user-unavailable">Usuario no disponible</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <button
        className="btn-back-home btn-brown"
        onClick={() => navigate("/")}
      >
        ← Volver a Home
      </button>

      <img
        src={user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
        alt="Foto de perfil"
        className="profile-img-nohover"
        onClick={() => navigate(`/ver-perfil/${uid}`)}
      />

      <div className="profile-name-container">
        <h2>{user.displayName || "Usuario sin nombre"}</h2>
        {isOwnProfile && (
          <button
            className="btn-edit-profile btn-green"
            onClick={() => navigate(`/editar-perfil/${uid}`)}
          >
            Editar perfil
          </button>
        )}
      </div>

      <div className="profile-info">
        <p><strong>Email:</strong> {user.email || "No disponible"}</p>
        {user.createdAt && (
          <p><strong>Cuenta creada:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        )}
        {user.type && <p><strong>Tipo:</strong> {user.type}</p>}
      </div>

      <h3 style={{ textAlign: "center", marginTop: "30px" }}>
        Publicaciones de {user.displayName || "este usuario"}
      </h3>

      <div className="profile-posts">
        <Posts uid={uid} />
      </div>
    </div>
  );
};

export default Profile;