import React, { useState } from "react";
import { auth } from "../db/firebase";
import Swal from "sweetalert2";
import { useDeletePost } from "../coostomhooks/useDeletePost";
import EditPostModal from "./EditPostModal";
import "../styles/PostCard.css";
import { FiEdit, FiX } from "react-icons/fi"; // íconos

const PostCard = ({ post, onDelete }) => {
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
      } catch (error) {
        console.error("Error eliminando post:", error);
      }
    }
  };

  const isOwner = currentUser && currentUser.uid === postData.uid;

  return (
    <>
      <div className="post-card">
        <p className="post-author">{postData.displayName || "Usuario desconocido"}</p>
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
          onUpdated={(updatedPost) => setPostData(updatedPost)}
        />
      )}
    </>
  );
};

export default PostCard;
