import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../db/firebase";
import Posts from "./Posts";
import { useUserByUid } from "../coostomhooks/UseUserByUid";
import { useToggleFollower } from "../coostomhooks/useToggleFollower";
import { FaUserCircle } from "react-icons/fa";
import "../styles/Profile.css";

const Profile = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { user, loading, error } = useUserByUid(uid);
  const { toggleFollower, loading: followLoading } = useToggleFollower();
  const [currentUid, setCurrentUid] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) setCurrentUid(currentUser.uid);
  }, []);

  useEffect(() => {
    if (user) {
      const followers = user.followers || [];
      setFollowersCount(followers.length);
      setIsFollowing(currentUid && followers.includes(currentUid));
    }
  }, [user, currentUid]);

  const isOwnProfile = currentUid === uid;

  const handleToggle = async () => {
    if (!currentUid || !uid) return;

    const { success, isFollowing: newFollowState } = await toggleFollower(uid, currentUid);
    if (success) {
      setIsFollowing(newFollowState);
      setFollowersCount((prev) => prev + (newFollowState ? 1 : -1));
    }
  };

  if (loading) {
    return (
      <div className="profile-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-center">
        <h2 className="user-unavailable">Usuario no disponible</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <button className="btn-back-home btn-brown" onClick={() => navigate("/")}>
        ← Volver a Home
      </button>

      <div
        className="profile-avatar-button"
        onClick={() => navigate(`/ver-perfil/${uid}`)}
        style={{ cursor: "pointer", display: "inline-block" }}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "Avatar"}
            className="profile-img-nohover"
          />
        ) : (
          <FaUserCircle style={{ fontSize: "80px", color: "#8e6e53" }} />
        )}
      </div>

      <div className="profile-name-container">
        <h2 className="profile-username">{user.displayName || "Usuario sin nombre"}</h2>

        <div className="profile-follow-info" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
  <span className="profile-followers">
    {followersCount} {followersCount === 1 ? "seguidor" : "seguidores"}
  </span>

  {isOwnProfile ? (
    <button
      className="btn-edit-profile btn-green"
      onClick={() => navigate(`/editar-perfil/${uid}`)}
      style={{ marginTop: "6px" }}  >
      Editar perfil
    </button>
  ) : (
    <button
      className="btn btn-brown btn-small"
      onClick={handleToggle}
      disabled={followLoading}
      style={{ marginTop: "6px" }} 
    >
      {followLoading
        ? "Cargando..."
        : isFollowing
        ? "Dejar de seguir"
        : "Seguir"}
    </button>
  )}
</div>

      </div>

      <div className="profile-info">
        {user.bio && (
          <p className="profile-bio">{user.bio}</p>
        )}
        <p>
          <strong>Email:</strong> {user.email || "No disponible"}
        </p>
        {user.createdAt && (
          <p>
            <strong>Cuenta creada:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        )}
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
