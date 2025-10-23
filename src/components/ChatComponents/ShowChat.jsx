import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChatById } from "../../coostomhooks/useGetChatBy_id";
import { useUserByUid } from "../../coostomhooks/UseUserByUid";
import { auth } from "../../db/firebase";
import { FaUserCircle } from "react-icons/fa";
import "../../styles/globalStyles.css";

const ShowChat = () => {
  const navigate = useNavigate();
  const { _id } = useParams();
  const currentUid = auth.currentUser?.uid;
  const { chat, loading: chatLoading, error: chatError } = useChatById(_id);

  const otherUid = chat?.usuarios?.find((u) => u !== currentUid) || null;
  const { user: otherUser, loading: userLoading, error: userError } =
    useUserByUid(otherUid);

  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  if (chatLoading || userLoading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          textAlign: "center",
        }}
      >
        <div className="spinner" style={{ width: "80px", height: "80px" }}></div>
        <p style={{ marginTop: "20px", fontSize: "1.2rem", color: "#555" }}>
          Cargando chat...
        </p>
      </div>
    );

  if (chatError || userError)
    return <p style={{ textAlign: "center" }}>Error al cargar el chat.</p>;

  if (!chat || !otherUser)
    return <p style={{ textAlign: "center" }}>No se encontró el chat o usuario.</p>;

  const sortedMessages = [...(chat.content || [])].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/.netlify/functions/addMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: _id, contenido: newMessage, uid: currentUid }),
      });
      if (!res.ok) throw new Error("Error enviando mensaje");

      setNewMessage("");
      window.location.reload(); // se puede mejorar luego
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      alert("Error enviando mensaje");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "2rem auto",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        borderRadius: "12px",
        backgroundColor: "#f5f5f5",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          gap: "10px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <button
          onClick={() => navigate("/chats")}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#8e6e53",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ←
        </button>

        {otherUser.photoURL ? (
          <img
            src={otherUser.photoURL}
            alt={otherUser.displayName}
            style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <FaUserCircle size={50} color="#8e6e53" />
        )}

        <h2 style={{ margin: 0 }}>{otherUser.displayName}</h2>
      </div>

      {/* Mensajes */}
      <div
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {sortedMessages.map((msg, index) => {
          const isMine = msg.uid === currentUid;
          return (
            <div
              key={index}
              style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}
            >
              <div
                style={{
                  backgroundColor: isMine ? "#8e6e53" : "#ddd",
                  color: isMine ? "white" : "black",
                  padding: "10px",
                  borderRadius: "12px",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                }}
              >
                {msg.contenido}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ddd",
          gap: "10px",
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribí un mensaje..."
          style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          disabled={sending}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "10px 16px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#8e6e53",
            color: "white",
            cursor: "pointer",
          }}
          disabled={sending}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ShowChat;
