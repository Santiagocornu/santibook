import React from "react";
import { auth } from "../db/firebase";
import Swal from "sweetalert2";
import { useDeletePost } from "../coostomhooks/useDeletePost";

const PostCard = ({ post, onEdit, onDelete }) => {
  const currentUser = auth.currentUser;
  const { deletePost } = useDeletePost();

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
        await deletePost(post._id); 
        Swal.fire("¡Eliminado!", "El post ha sido eliminado.", "success");
        if (onDelete) onDelete(); 
      } catch (error) {}
    }
  };

  const handleEdit = () => {
    if (onEdit) onEdit(post);
  };

  const isOwner = currentUser && currentUser.uid === post.uid;

  return (
    <div
      style={{
        backgroundColor: "#8e6e53",
        color: "white",
        padding: "20px",
        borderRadius: "15px",
        marginBottom: "15px",
        boxShadow: "0 0 8px rgba(0,0,0,0.2)",
      }}
    >
      <p style={{ margin: "0 0 5px 0", fontWeight: "bold", color: "#f0e0d0", fontSize: "1rem" }}>
        {post.displayName || "Usuario desconocido"}
      </p>
      <h2 style={{ margin: "0 0 10px 0" }}>{post.title}</h2>
      <p style={{ margin: "0 0 10px 0" }}>{post.content}</p>
      <p style={{ margin: 0, fontSize: "0.85rem", color: "#d3d3d3" }}>
        {new Date(post.createdAt).toLocaleString()}
      </p>

      {isOwner && (
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button
            onClick={handleEdit}
            style={{
              backgroundColor: "#f0e0d0",
              color: "#8e6e53",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "#d33",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
