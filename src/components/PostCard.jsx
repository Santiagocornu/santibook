import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../db/firebase";
import Swal from "sweetalert2";
import { useDeletePost } from "../coostomhooks/useDeletePost";
import EditPostModal from "./EditPostModal";
import VerComentarios from "./VerComentarios";
import "../styles/PostCard.css";
import { FiEdit, FiX } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CrearComentario from "./CrearComentario";

const PostCard = ({ post, onDelete, onUpdate }) => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const { deletePost } = useDeletePost();
  const [showEdit, setShowEdit] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [postData, setPostData] = useState(post);
  const [likes, setLikes] = useState(post.likes || []);

  const hasLiked = currentUser && likes.includes(currentUser.uid);
  const isOwner = currentUser && currentUser.uid === postData.uid;

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
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error("Error eliminando post:", error);
      }
    }
  };

  const handleUpdated = (updatedPost) => {
    setPostData(updatedPost);
    if (onUpdate) onUpdate();
  };

  const handleLike = () => {
    if (!currentUser) {
      Swal.fire("Inicia sesión", "Debes iniciar sesión para dar like", "info");
      return;
    }

    setLikes((prevLikes) =>
      prevLikes.includes(currentUser.uid)
        ? prevLikes.filter((uid) => uid !== currentUser.uid)
        : [...prevLikes, currentUser.uid]
    );

    const updatedLikes = hasLiked
      ? likes.filter((uid) => uid !== currentUser.uid)
      : [...likes, currentUser.uid];

    fetch(`/.netlify/functions/updatePostLikes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: postData._id,
        likes: updatedLikes,
      }),
    }).catch((err) => console.error("Error actualizando likes:", err));
  };

  return (
    <>
      <div className="post-card">
        <div
          className="post-author-info"
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate(`/ver-perfil/${postData.uid}`)}
        >
          <img
            src={
              postData.photoURL ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
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
          <p className="post-author">
            {postData.displayName || "Usuario desconocido"}
          </p>
        </div>

        
        <h2
          className="post-title"
          onClick={() => setShowComments(true)}
          style={{ cursor: "pointer" }}
        >
          {postData.title}
        </h2>

        <p
          className="post-content"
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            cursor: "pointer",
          }}
          onClick={() => setShowComments(true)}
        >
          {postData.content}
        </p>

        <p className="post-date">
          {new Date(postData.createdAt).toLocaleString()}
          {postData.editado && <span className="post-edited">editado</span>}
        </p>

        <div className="post-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className="btn-like"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              transition: "transform 0.15s ease",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {hasLiked ? (
              <FaHeart style={{ color: "#b22222", fontSize: "20px" }} />
            ) : (
              <FaRegHeart style={{ color: "#b22222", fontSize: "20px" }} />
            )}
            <span style={{ color: "#333" }}>{likes.length}</span>
          </button>

          <CrearComentario
            postId={post._id}
            onCommentAdded={(newComment) => {}}
          />

          {isOwner && (
            <>
              <button
                className="btn btn-vintage"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEdit(true);
                }}
              >
                <FiEdit style={{ marginRight: "5px" }} />
                Editar
              </button>
              <button
                className="btn btn-vintage"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <FiX style={{ marginRight: "5px" }} />
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>

      {showEdit && (
        <EditPostModal
          post={postData}
          onClose={() => setShowEdit(false)}
          onUpdated={handleUpdated}
        />
      )}

      {showComments && (
        <VerComentarios
          post={postData}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  );
};

export default PostCard;
