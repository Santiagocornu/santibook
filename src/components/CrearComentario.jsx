import React, { useState } from "react";
import { FaCommentAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useComentPost } from "../coostomhooks/useComentPost";
import "../styles/globalStyles.css";
import "../styles/PostCard.css";

const CrearComentario = ({ postId, onCommentAdded }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const { comentPost, loading } = useComentPost();
  const maxChars = 255;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      Swal.fire("Error", "El comentario no puede estar vacío", "error");
      return;
    }

    try {
      const comment = await comentPost({ postId, content });
      Swal.fire("Éxito", "Comentario agregado", "success");
      setContent("");
      setOpen(false);
      if (onCommentAdded) onCommentAdded(comment);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "No se pudo agregar el comentario", "error");
    }
  };

  return (
    <>
      <div>
        <button
          className="btn btn-brown comment-btn"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <FaCommentAlt />
          Comentar
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="modal-overlay"
          
          onClick={() => setOpen(false)}
        >
          <div
            className="create-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-title">Dejar un comentario</h3>
            <textarea
              className="input-white textarea-comment"
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
              placeholder="Escribe tu comentario..."
            />
            <div className="char-counter">
              {content.length}/{maxChars}
            </div>
            <div className="btn-row-end">
              <button
                className="btn btn-red"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="btn btn-green"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Publicando..." : "Comentar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CrearComentario;