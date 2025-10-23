import React, { useState, useMemo } from "react";
import { auth } from "../../db/firebase";
import Swal from "sweetalert2";
import { useUser } from "../../coostomhooks/useUsers";
import { useCreateChat } from "../../coostomhooks/useCreateChat";

const SearchPeople = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = auth.currentUser;
  const uid = currentUser?.uid;

  const { users, loading, error } = useUser(); 
  const { createChat } = useCreateChat();

  // Filtrado local por displayName (excluye al usuario actual)
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users.filter((u) => u.uid !== uid);
    return users.filter(
      (u) =>
        u.uid !== uid &&
        u.displayName?.toLowerCase().includes(term) 
    );
  }, [users, searchTerm, uid]);

  const handleCreateChat = async (otherUid) => {
    if (!uid || !otherUid) return;
    if (uid === otherUid) {
      Swal.fire("Atención", "No podés crear un chat con vos mismo.", "info");
      return;
    }

    try {
      await createChat([uid, otherUid]); 
      Swal.fire({
        icon: "success",
        title: "Chat creado",
        text: "Ya podés hablar con este usuario",
        timer: 1500,
        showConfirmButton: false,
      });
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo crear el chat.", "error");
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#f9f4ef",
          borderRadius: "12px",
          padding: "20px",
          width: "400px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 0 5px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ marginBottom: "15px", textAlign: "center" }}>
          Buscar usuarios para chatear 
        </h3>

        {/* Barra de búsqueda */}
        <div style={{ display: "flex", marginBottom: "10px" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre..."
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Resultados */}
        {loading ? (
          <p style={{ textAlign: "center" }}>Cargando usuarios...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "red" }}>
            Error al cargar usuarios.
          </p>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.uid}
              style={{
                backgroundColor: "#8e6e53",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={
                    user.photoURL ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  }
                  alt="user"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    backgroundColor: "white",
                  }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    {user.displayName || "Sin nombre"} 
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8 }}>
                    {user.email || "Sin email"}
                  </p>
                </div>
              </div>
              <button
                className="btn btn-green"
                onClick={() => handleCreateChat(user.uid)}
              >
                Chatear
              </button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#8e6e53" }}>
            {searchTerm
              ? "No se encontraron usuarios con ese nombre."
              : "Escribe un nombre para empezar a buscar."}
          </p>
        )}

        {/* Botón cerrar */}
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button className="btn btn-red" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPeople;