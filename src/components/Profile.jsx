import React, { useEffect, useState } from "react";

const Profile = ({ uid }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/.netlify/functions/getUser?uid=${uid}`);
        if (!res.ok) throw new Error("No se pudo obtener el usuario");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [uid]);

  if (!uid) return <p>No se proporcionó un UID.</p>;
  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No se encontró el usuario.</p>;

  return (
    <div
      style={{
        background: "#fff",
        color: "#222",
        borderRadius: "12px",
        padding: "20px",
        maxWidth: "400px",
        margin: "20px auto",
        boxShadow: "0 0 8px rgba(0,0,0,0.15)",
        textAlign: "center",
      }}
    >
      <img
        src={
          user.photoURL ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }
        alt="Foto de perfil"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "15px",
          border: "2px solid #ccc",
        }}
      />
      <h2>{user.displayName || "Usuario sin nombre"}</h2>
      <p><strong>Email:</strong> {user.email || "No disponible"}</p>
      {user.createdAt && (
        <p>
          <strong>Cuenta creada:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      )}
      {user.type && (
        <p>
          <strong>Tipo:</strong> {user.type}
        </p>
      )}
    </div>
  );
};

export default Profile;
