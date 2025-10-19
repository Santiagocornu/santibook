import React, { useState } from "react";
import Swal from "sweetalert2";
import { useEditPost } from "../coostomhooks/useEditPost";
import "../styles/PostCard.css";

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
    <div className="modal-overlay">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Editar Post</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
          className="input-white"
          required
          disabled={loading}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contenido"
          className="textarea-post"
          required
          disabled={loading}
         
        />

        <div className="btn-row-end">
          <button
            type="button"
            className="btn btn-red"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-green" disabled={loading}>
            {loading ? "Editando..." : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostModal;
