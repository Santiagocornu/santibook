import { useState } from "react";
import { usePosts } from "../coostomhooks/usePosts";
import PostCard from "./PostCard";
import "../styles/globalStyles.css"; // spinner y estilos globales

const Posts = ({ uid, searchTerm = "", filterBy = "todo" }) => {
  const { posts, loading, error, refetch } = usePosts(); 

  // Filtrar posts
  let filteredPosts = posts;

  if (uid) filteredPosts = filteredPosts.filter((post) => post.uid === uid);

  filteredPosts = filteredPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterBy === "posts") filteredPosts = filteredPosts.filter((post) => post.type === "post");
  else if (filterBy === "cuentas") filteredPosts = filteredPosts.filter((post) => post.type === "cuenta");

  filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleReload = () => {
    if (refetch) refetch();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", position: "relative" }}>
      {/* Botón fijo de actualizar posts, movido aquí */}
      <button
        onClick={handleReload}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          padding: "12px 20px",
          backgroundColor: "#8e6e53",
          color: "#fff",
          border: "none",
          borderRadius: "50px",
          cursor: "pointer",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        Actualizar
      </button>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p>Error: {error}</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p>No hay publicaciones disponibles.</p>
        </div>
      ) : (
        filteredPosts.map((post) => (
          <PostCard key={post._id} post={post} onUpdate={handleReload} />
        ))
      )}
    </div>
  );
};

export default Posts;