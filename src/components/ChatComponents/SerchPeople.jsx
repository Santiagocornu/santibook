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
        u.uid !== uid && u.displayName?.toLowerCase().includes(term)
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
        position: "fixed",
        inset: 0,
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#f9f4ef",
          borderRadius: "16px",
          padding: "20px",
          width: "420px",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            marginBottom: "15px",
            textAlign: "center",
            color: "#5a4632",
            fontWeight: "600",
          }}
        >
          Buscar usuarios para chatear
        </h3>

        {/* Barra de búsqueda */}
        <div style={{ display: "flex", width: "100%", marginBottom: "15px" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Resultados */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
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
                  padding: "12px 16px",
                  borderRadius: "12px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  height: "80px",
                  boxSizing: "border-box",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 10px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flex: 1,
                  }}
                >
                  <img
                    src={
                      user.photoURL ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt="user"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      backgroundColor: "white",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: "bold",
                        fontSize: "1rem",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {user.displayName || "Sin nombre"}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        opacity: 0.9,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {user.email || "Sin email"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateChat(user.uid);
                  }}
                  style={{
                    backgroundColor: "white",
                    color: "#8e6e53",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f1e6d6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
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
        </div>

        {/* Botón cerrar */}
        <div style={{ textAlign: "center", marginTop: "20px", width: "100%" }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#8e6e53",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPeople;
