import React, { useState, useEffect } from "react";
import { auth } from "../db/firebase";
import Swal from "sweetalert2";
import "../styles/globalStyles.css";

const CreatePost = ({ onPostCreated, onCancel }) => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const maxChars = 255;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user || user.isAnonymous) {
    Swal.fire("Error", "Debes iniciar sesión para crear un post", "error");
    return;
  }

  if (!title || !body) {
    Swal.fire("Error", "Debes completar el título y el cuerpo del post", "error");
    return;
  }

  // Obtenemos uid y displayName directamente de Firebase
  const uid = user.uid;
  const displayName = user.displayName || 'Usuario';

  const newPost = {
    uid,
    displayName,
    title,
    content: body,
    createdAt: new Date(),
    type: "post",
  };

  try {
    setLoading(true);
    const response = await fetch("/.netlify/functions/addPost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });

    if (!response.ok) throw new Error("Error al guardar el post");

    const result = await response.json();
    Swal.fire("Éxito", "Post creado correctamente", "success");

    setTitle("");
    setBody("");

    if (onPostCreated) onPostCreated(result);
  } catch (error) {
    console.error(error);
    Swal.fire("Error", error.message, "error");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="form-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Crear Post</h2>

        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-white"
          maxLength={50}
          disabled={loading}
        />

        <textarea
          placeholder="Escribe algo para la gente..."
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, maxChars))}
          className="input-white"
          style={{
            height: "120px",
            resize: "none",
            padding: "12px",
            borderRadius: "12px",
            border: "2px solid #ccc",
            transition: "border 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#5b3f2a"}
          onBlur={(e) => e.target.style.borderColor = "#ccc"}
          disabled={loading}
        />
        <div style={{ textAlign: "right", fontSize: "0.85rem", color: "#d3d3d3", marginBottom: "10px" }}>
          {body.length}/{maxChars}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            type="button"
            className="btn btn-red"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-green" disabled={loading}>
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
