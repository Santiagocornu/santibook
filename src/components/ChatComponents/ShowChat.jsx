import React, { useState, useEffect, useRef, useCallback } from "react";
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

  const { chat, error: chatError } = useChatById(_id);
  const otherUid = chat?.usuarios?.find((u) => u !== currentUid) || null;
  const { user: otherUser, error: userError } = useUserByUid(otherUid);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [lastMessageDate, setLastMessageDate] = useState(new Date().toISOString());
  const [showLoadMore, setShowLoadMore] = useState(false); // Para mostrar el botón
  const [loadingMore, setLoadingMore] = useState(false); // Para spinner en carga

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll automático al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async (beforeDate = null) => {
  try {
    setLoadingMore(true);
    const url = beforeDate
      ? `/.netlify/functions/getMessages?id=${_id}&limit=20&beforeDate=${beforeDate}`
      : `/.netlify/functions/getMessages?id=${_id}&limit=20`;

    const res = await fetch(url, {
      headers: {
        "x-api-key": process.env.REACT_APP_API_SECRET_KEY,
      },
    });
    if (!res.ok) throw new Error("Error obteniendo mensajes");
    const data = await res.json();

    if (beforeDate) {
      setMessages((prev) => {
        const existingDates = prev.map((m) => m.date);
        const uniqueNew = data.filter((m) => !existingDates.includes(m.date));
        return [...uniqueNew, ...prev].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      });
      if (data.length === 0) setShowLoadMore(false);
    } else {
      setMessages(data);
      if (data.length > 0) setLastMessageDate(data[data.length - 1].date);
    }
  } catch (err) {
    console.error("Error cargando mensajes:", err);
  } finally {
    setLoadingMessages(false);
    setLoadingMore(false);
  }
}, [_id]);


  const checkNewMessages = useCallback(async () => {
  try {
    const res = await fetch(
      `/.netlify/functions/checkNewMessages?chatId=${_id}&lastMessageDate=${lastMessageDate}`,
      { headers: { "x-api-key": process.env.REACT_APP_API_SECRET_KEY } }
    );
    if (!res.ok) throw new Error("Error checando mensajes");
    const newMessages = await res.json();
    if (newMessages.length > 0) {
      setMessages((prev) => {
        const existingDates = prev.map((m) => m.date);
        const uniqueNew = newMessages.filter(
          (m) => !existingDates.includes(m.date)
        );
        return [...prev, ...uniqueNew].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      });
      setLastMessageDate(newMessages[newMessages.length - 1].date);
      scrollToBottom();
    }
  } catch (err) {
    console.error("Error en polling:", err);
  }
}, [_id, lastMessageDate]);


  const loadMoreMessages = () => {
    if (messages.length > 0) {
      const oldestDate = messages[0].date;
      fetchMessages(oldestDate);
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (container.scrollTop === 0 && messages.length >= 20) {
        setShowLoadMore(true);
      } else {
        setShowLoadMore(false);
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages]);

 useEffect(() => {
  fetchMessages();
  const interval = setInterval(checkNewMessages, 5000);
  return () => clearInterval(interval);
}, [fetchMessages, checkNewMessages]);


  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    const tempMessage = {
      uid: currentUid,
      contenido: newMessage.trim(),
      date: new Date().toISOString(),
      _temp: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");
    setSending(true);

    try {
      const res = await fetch(`/.netlify/functions/addMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_SECRET_KEY,
        },
        body: JSON.stringify({
          chatId: _id,
          contenido: tempMessage.contenido,
          uid: tempMessage.uid,
        }),
      });
      if (!res.ok) throw new Error("Error enviando mensaje");

      await fetchMessages();
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      setMessages((prev) => prev.filter((m) => !m._temp));
      alert("Error al enviar mensaje");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (chatError || userError)
    return <p style={{ textAlign: "center" }}>Error al cargar el chat.</p>;

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
          backgroundColor: "white",
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
          <FaUserCircle size={50} color="#8e6e53" />
        )}

        <h2 style={{ margin: 0 }}>{otherUser?.displayName || "Usuario"}</h2>
      </div>

      {/* Mensajes */}
      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          position: "relative",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Botón para cargar más */}
        {showLoadMore && (
          <button
            onClick={loadMoreMessages}
            disabled={loadingMore}
            style={{
              alignSelf: "center",
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: "#8e6e53",
              color: "white",
              cursor: "pointer",
              marginBottom: "10px",
              opacity: loadingMore ? 0.6 : 1,
            }}
          >
            {loadingMore ? "Cargando..." : "Cargar más mensajes"}
          </button>
        )}

        {loadingMessages && (
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              opacity: 0.8,
            }}
          >
            <div className="spinner" style={{ width: "50px", height: "50px" }}></div>
          </div>
        )}

        {messages.map((msg, index) => {
          const isMine = msg.uid === currentUid;
          return (
            <div
              key={`${msg.date}-${index}`} // Mejor key para evitar conflictos
              style={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  backgroundColor: isMine ? "#8e6e53" : "#ddd",
                  color: isMine ? "white" : "black",
                  padding: "10px",
                  borderRadius: "12px",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                  opacity: msg._temp ? 0.6 : 1,
                }}
              >
                {msg.contenido}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ddd",
          gap: "10px",
          backgroundColor: "white",
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribí un mensaje..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
          }}
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
            opacity: sending ? 0.6 : 1,
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
