import React, { useState, useEffect } from "react";
import { auth } from "../../db/firebase";
import { useGetChatByUid } from "../../coostomhooks/useGetChatByUid";
import { useUserByUid } from "../../coostomhooks/UseUserByUid";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../../styles/globalStyles.css";
import SearchPeople from "./SerchPeople";

const Chats = () => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const uid = currentUser?.uid;
  const { chats, loading, error } = useGetChatByUid(uid);

  const [showModal, setShowModal] = useState(false);
  const [otherUsersData, setOtherUsersData] = useState({});

  useEffect(() => {
    if (!chats || chats.length === 0) return;

    const fetchOtherUsers = async () => {
      const data = {};
      await Promise.all(
        chats.map(async (chat) => {
          const otherUid = chat.usuarios.find((u) => u !== uid);
          if (!otherUid) return;

          try {
            const res = await fetch(
              `/.netlify/functions/getUserByUid?uid=${otherUid}`
            );
            if (!res.ok) throw new Error("Error al obtener usuario");
            const userData = await res.json();
            data[otherUid] = userData;
          } catch (err) {
            console.error("Error fetching user:", err);
          }
        })
      );
      setOtherUsersData(data);
    };

    fetchOtherUsers();
  }, [chats, uid]);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Botón para volver */}
      <button
        onClick={() => navigate("/")}
        style={{
          alignSelf: "flex-start",
          padding: "6px 12px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#8e6e53",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        ← Volver
      </button>

      {/* Header: título + nuevo chat */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center", flex: 1 }}>Tus chats</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#8e6e53",
            color: "white",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          Nuevo chat
        </button>
      </div>

      {/* Contenido */}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <div className="spinner"></div>
          <p style={{ marginTop: "10px" }}>Cargando chats...</p>
        </div>
      ) : error ? (
        <p style={{ textAlign: "center" }}>Error al cargar chats. Intenta de nuevo.</p>
      ) : !chats || chats.length === 0 ? (
        <p style={{ textAlign: "center" }}>No tenés chats aún.</p>
      ) : (
        chats.map((chat) => {
          if (!chat) return null;

          const otherUid = chat.usuarios.find((u) => u !== uid);
          const otherUser = otherUsersData[otherUid];

          const lastMessage =
            Array.isArray(chat.content) && chat.content.length > 0
              ? chat.content[chat.content.length - 1]
              : null;

          let lastMessageText = "Sin mensajes aún";
          if (lastMessage) {
            const senderName =
              lastMessage.uid === uid ? "Vos" : otherUser?.displayName || "Usuario";
            lastMessageText = `${senderName}: ${lastMessage.contenido}`;
          }

          return (
            <div
              key={chat._id.$oid || chat._id}
              onClick={() => navigate(`/chat/${chat._id.$oid || chat._id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#8e6e53",
                color: "white",
                padding: "10px",
                borderRadius: "12px",
                marginBottom: "10px",
                boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                cursor: "pointer",
              }}
            >
              {otherUser?.photoURL ? (
                <img
                  src={otherUser.photoURL}
                  alt={otherUser.displayName}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <FaUserCircle size={50} color="#f0e0d0" />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>
                  {otherUser?.displayName || "Usuario desconocido"}
                </p>
                <p
                  style={{
                    margin: "5px 0",
                    fontSize: "0.9rem",
                    color: "#f0e0d0",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {lastMessageText}
                </p>
              </div>
            </div>
          );
        })
      )}

      {/* Modal */}
      {showModal && <SearchPeople onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Chats;
