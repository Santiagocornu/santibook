import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../db/firebase";
import Swal from "sweetalert2";
import { useDeletePost } from "../coostomhooks/useDeletePost";
import EditPostModal from "./EditPostModal";
import "../styles/PostCard.css";
import { FiEdit, FiX } from "react-icons/fi"; 

const PostCard = ({ post, onDelete, onUpdate }) => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const { deletePost } = useDeletePost();
  const [showEdit, setShowEdit] = useState(false);
  const [postData, setPostData] = useState(post);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deletePost(postData._id);
        Swal.fire("¡Eliminado!", "El post ha sido eliminado.", "success");
        if (onDelete) onDelete();
        if (onUpdate) onUpdate(); // 🔹 avisa al padre que recargue
      } catch (error) {
        console.error("Error eliminando post:", error);
      }
    }
  };

  const handleUpdated = (updatedPost) => {
    setPostData(updatedPost);
    if (onUpdate) onUpdate(); // 🔹 recarga lista al editar
  };

  const isOwner = currentUser && currentUser.uid === postData.uid;

  return (
    <>
      <div className="post-card">
        <div
          className="post-author-info"
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate(`/ver-perfil/${postData.uid}`)}
        >
          <img
            src={postData.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt={postData.displayName || "Usuario desconocido"}
            className="profile-img"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "10px",
              border: "2px solid #ccc",
            }}
          />
          <p className="post-author">{postData.displayName || "Usuario desconocido"}</p>
        </div>

        <h2 className="post-title">{postData.title}</h2>
        <p className="post-content">{postData.content}</p>
        <p className="post-date">
          {new Date(postData.createdAt).toLocaleString()}
          {postData.editado && <span className="post-edited">editado</span>}
        </p>

        {isOwner && (
          <div className="post-actions">
            <button
              className="btn btn-vintage"
              onClick={() => setShowEdit(true)}
            >
              <FiEdit style={{ marginRight: "5px" }} />
              Editar
            </button>
            <button
              className="btn btn-vintage"
              onClick={handleDelete}
            >
              <FiX style={{ marginRight: "5px" }} />
              Eliminar
            </button>
          </div>
        )}
      </div>

      {showEdit && (
        <EditPostModal
          post={postData}
          onClose={() => setShowEdit(false)}
          onUpdated={handleUpdated}
        />
      )}
    </>
  );
};

export default PostCard;
