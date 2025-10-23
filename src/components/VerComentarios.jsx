import React, { useState } from "react";
import CrearComentario from "./CrearComentario";
import { FaTimes } from "react-icons/fa";
import "../styles/PostCard.css";

const VerComentarios = ({ post, onClose }) => {
  const [postData, setPostData] = useState(post);

  const handleNewComment = (newComment) => {
    setPostData((prev) => ({
      ...prev,
      comentarios: prev.comentarios ? [...prev.comentarios, newComment] : [newComment],
    }));
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 3000,
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          background: "#f5f5dc",
          padding: "16px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "8px",
          borderBottom: "1px solid #d2b48c",
        }}>
          <h2 style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "bold",
            color: "#8b4513",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}>
            {postData.title || "Post"}
          </h2>
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#a0522d",
              padding: "6px",
              borderRadius: "50%",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#d2b48c"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* Contenido del post */}
        <div style={{ margin: "12px 0", overflowWrap: "break-word" }}>
          <p style={{
            margin: 0,
            color: "#654321",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineHeight: "1.5",
          }}>
            {postData.content}
          </p>
          <p style={{
            fontSize: "12px",
            color: "#a0522d",
            marginTop: "4px",
            fontStyle: "italic"
          }}>
            {postData.displayName} - {new Date(postData.createdAt).toLocaleString()}
            {postData.editado && <span style={{ marginLeft: "10px" }}>(editado)</span>}
          </p>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #d2b48c", margin: "12px 0" }} />

        {/* Comentarios */}
        <h3 style={{
          marginBottom: "12px",
          color: "#8b4513",
          fontSize: "18px",
          fontWeight: "bold"
        }}>Comentarios</h3>

        <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }}>
          {postData.comentarios && postData.comentarios.length > 0 ? (
            postData.comentarios.map((c, index) => (
              <div key={index} style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "12px",
                gap: "10px",
                padding: "10px",
                backgroundColor: "#faf0e6",
                borderRadius: "8px",
                border: "1px solid #d2b48c",
                minWidth: 0,
              }}>
                <img
                  src={c.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt={c.displayName || "Usuario"}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: "0 0 4px 0",
                    fontWeight: "bold",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    color: "#8b4513",
                    fontSize: "14px",
                  }}>
                    {c.displayName || "Usuario"}
                  </p>
                  <p style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    color: "#654321",
                    lineHeight: "1.4",
                    fontSize: "14px",
                  }}>
                    {c.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#a0522d", fontStyle: "italic" }}>No hay comentarios aún.</p>
          )}
        </div>

        {/* Crear comentario */}
        <div style={{ marginTop: "16px" }}>
          <CrearComentario postId={postData._id} onCommentAdded={handleNewComment} />
        </div>
      </div>
    </div>
  );
};

export default VerComentarios;
