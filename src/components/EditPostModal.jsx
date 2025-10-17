import React, { useState } from "react";
import Swal from "sweetalert2";
import { useEditPost } from "../coostomhooks/useEditPost";

const EditPostModal = ({ post, onClose, onUpdated }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [loading, setLoading] = useState(false);
  const { editPost } = useEditPost();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await editPost({ id: post._id, title, content, editado: true });

      Swal.fire("¡Listo!", "Post editado correctamente", "success");
      onUpdated({ ...post, title, content, editado: true });
      onClose();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
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
        zIndex: 1000,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          minWidth: "300px",
        }}
      >
        <h2>Editar Post</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
          required
          style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contenido"
          required
          style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button type="button" onClick={onClose} style={{ padding: "5px 10px" }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading} style={{ padding: "5px 10px" }}>
            {loading ? "Editando..." : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostModal;
