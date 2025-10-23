import { usePosts } from "../coostomhooks/usePosts";
import { useUser } from "../coostomhooks/useUsers";
import PostCard from "./PostCard";
import ProfileCard from "./ProfileCard";
import "../styles/globalStyles.css"; 

const Posts = ({ uid, filterBy = "todo", searchTerm = "", posts: propPosts, loading: propLoading, error: propError, onUpdate }) => {
  // Usa props si se pasan, sino usa los hooks (para compatibilidad)
  const { posts: hookPosts = [], loading: hookLoading, error: hookError, refetch: refetchPosts } = usePosts(); 
  const { users = [], loading: usersLoading, error: usersError, refetch: refetchUsers } = useUser(); 

  const posts = propPosts || hookPosts;
  const loading = propLoading !== undefined ? propLoading : (filterBy === "cuentas" ? usersLoading : hookLoading);
  const error = propError !== undefined ? propError : (filterBy === "cuentas" ? usersError : hookError);
  const handleReload = onUpdate || (() => (filterBy === "cuentas" ? refetchUsers() : refetchPosts()));

  // Filtrar posts (sin cambios, pero ahora usa el searchTerm si filterBy es "posts")
  let filteredPosts = Array.isArray(posts) ? posts : [];
  if (uid) filteredPosts = filteredPosts.filter((post) => post.uid === uid);
  if (filterBy === "posts" && searchTerm) {
    // Filtrar posts por contenido (ej. título o descripción), ajusta según tu modelo de datos
    filteredPosts = filteredPosts.filter((post) =>
      (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
  filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Filtrar usuarios por nombre (usando searchTerm de props, coincidencia exacta como pediste)
  let filteredUsers = Array.isArray(users) ? users : [];
  if (filterBy === "cuentas" && searchTerm) {
   filteredUsers = filteredUsers.filter((user) =>
  user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
);
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", position: "relative" }}>
      {/* Botón fijo de actualizar */}
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
      ) : filterBy === "cuentas" ? (
        filteredUsers.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <p>{searchTerm ? `No se encontraron usuarios con "${searchTerm}".` : "No se encontraron usuarios."}</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <ProfileCard key={user.uid} user={user} />
          ))
        )
      ) : filteredPosts.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p>{searchTerm && filterBy === "posts" ? `No se encontraron posts con "${searchTerm}".` : "No hay publicaciones disponibles."}</p>
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