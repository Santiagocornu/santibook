import React, { useState } from "react";
import { auth } from "../../db/firebase";
import { useGetChatByUid } from "../../coostomhooks/useGetChatByUid";
import { useNavigate } from "react-router-dom";
import "../../styles/globalStyles.css";
import SearchPeople from "./SerchPeople";

const Chats = () => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const uid = currentUser?.uid;
  const { chats, loading, error } = useGetChatByUid(uid);

  const [showModal, setShowModal] = useState(false);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Botón para volver al Home */}
      <button
        onClick={() => navigate("/")}
        className="btn btn-brown"
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          padding: "8px 16px",
        }}
      >
        ← Volver
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          marginTop: "10px",
        }}
      >
        <h2 style={{ margin: 0 }}>Tus chats</h2>
        <button
          className="btn btn-green"
          onClick={() => setShowModal(true)}
        >
           Nuevo chat
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <div className="spinner"></div>
          <p style={{ marginTop: "10px" }}>Cargando chats...</p>
        </div>
      ) : error ? (
        <p style={{ textAlign: "center" }}>
          Error al cargar chats. Intenta de nuevo.
        </p>
      ) : !chats || chats.length === 0 ? (
        <p style={{ textAlign: "center" }}>No tenés chats aún.</p>
      ) : (
        chats.map((chat) => {
          if (!chat) return null;
          const otherUser = chat.usuarios.find((u) => u !== uid);
          const lastMessage =
            Array.isArray(chat.content) && chat.content.length > 0
              ? chat.content[chat.content.length - 1].contenido
              : "Sin mensajes aún";

          return (
            <div
              key={chat._id}
              onClick={() => navigate(`/chat/${chat._id}`)}
              style={{
                backgroundColor: "#8e6e53",
                color: "white",
                padding: "15px",
                borderRadius: "12px",
                marginBottom: "10px",
                boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                cursor: "pointer",
              }}
            >
              <p style={{ margin: 0, fontWeight: "bold" }}>
                Chat con: {otherUser || "Usuario desconocido"}
              </p>
              <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#f0e0d0" }}>
                {lastMessage}
              </p>
            </div>
          );
        })
      )}

      {/* Modal para buscar usuarios */}
      {showModal && <SearchPeople onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Chats;
