import { usePosts } from "../coostomhooks/usePosts";
import PostCard from "./PostCard";

const Posts = ({ uid, searchTerm = "", filterBy = "todo" }) => {
  const { posts, loading, error } = usePosts(); // Usar usePosts para obtener posts
  // Filtrar posts basado en uid, searchTerm y filterBy
  let filteredPosts = posts;
  // Si hay uid, filtrar por uid (asumiendo que posts tiene uid)
  if (uid) {
    filteredPosts = filteredPosts.filter(post => post.uid === uid);
  }
  // Filtrar por palabra clave
  filteredPosts = filteredPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Filtrar por tipo
  if (filterBy === "posts") {
    filteredPosts = filteredPosts.filter(post => post.type === "post");
  } else if (filterBy === "cuentas") {
    filteredPosts = filteredPosts.filter(post => post.type === "cuenta");
  }
  if (loading) return <p>Cargando publicaciones...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!filteredPosts.length) return <p>No hay publicaciones disponibles.</p>;
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h3>{uid ? "Publicaciones del usuario" : "Todas las publicaciones"}</h3>
      {filteredPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};
export default Posts;