// src/components/ProfileCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const ProfileCard = ({ user }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ver-perfil/${user.uid}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: "#fff",
        borderRadius: "15px",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
        padding: "15px",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        cursor: "pointer",
        transition: "transform 0.1s ease, box-shadow 0.1s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = "0px 6px 12px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0px 4px 8px rgba(0,0,0,0.1)";
      }}
    >
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt={user.displayName}
          style={{ width: "60px", height: "60px", borderRadius: "50%" }}
        />
      ) : (
        <FaUserCircle style={{ fontSize: "60px", color: "#ccc" }} />
      )}

      <div>
        <h3 style={{ margin: 0 }}>{user.displayName}</h3>
       
      </div>
    </div>
  );
};

export default ProfileCard;
