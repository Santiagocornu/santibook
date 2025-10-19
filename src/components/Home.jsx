import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../db/firebase";
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import "../styles/HomeStyles.css";
import Posts from "./Posts";
import CreatePost from "./CreatePost";
import OpcionesPerfil from "./OpcionesPerfil";
import { usePosts } from "../coostomhooks/usePosts";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("todo");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showOpciones, setShowOpciones] = useState(false);
  const [appliedSearch, setAppliedSearch] = useState({ term: "", filter: "todo" });

  // **Estado centralizado de posts desde el hook**
  const { posts: fetchedPosts, loading, error, refetch } = usePosts();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire("¡Éxito!", "Has cerrado sesión", "success").then(() => {
        navigate("/login");
      });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleLoginRedirect = () => navigate("/login");
  const showLogoutButton = user && !user.isAnonymous;

  const handleApplySearch = () => {
    setAppliedSearch({ term: searchTerm.trim(), filter: filterBy });
  };

  const handleReloadPosts = async () => {
    if (refetch) {
      await refetch(); 
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          {user && !user.isAnonymous && (
            <img
              src={user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="perfil"
              className="profile-img"
              onClick={() => setShowOpciones(true)}
            />
          )}
        </div>

        <div className="navbar-center">
          <div className="search-bar">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="search-select"
            >
              <option value="todo">Todo</option>
              <option value="posts">Posts</option>
              <option value="cuentas">Cuentas</option>
            </select>

            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <button
              type="button"
              className="search-btn btn btn-brown"
              onClick={handleApplySearch}
            >
              🔍
            </button>
          </div>
        </div>

        <div className="navbar-right">
          {showLogoutButton ? (
            <button onClick={handleLogout} className="btn btn-red">
              Cerrar Sesión
            </button>
          ) : (
            <button onClick={handleLoginRedirect} className="btn btn-green">
              Iniciar Sesión
            </button>
          )}
        </div>
      </nav>

      {/* Mensaje de bienvenida */}
      <div className="home-welcome">
        {user && !user.isAnonymous && (
          <p>
            Bienvenido{" "}
            <strong>{user.displayName || user.email || "Usuario"}</strong>
          </p>
        )}
        {user && user.isAnonymous && <p>Bienvenido invitado</p>}
      </div>

      {/* Posts filtrados, ahora reciben los posts directamente desde el hook */}
      <Posts
        posts={fetchedPosts}  
        loading={loading}
        error={error}
        searchTerm={appliedSearch.term}
        filterBy={appliedSearch.filter}
        onUpdate={handleReloadPosts}
      />

      {/* Botón flotante de crear post */}
      <button
        onClick={() => setShowCreatePost(true)}
        className="floating-btn btn btn-brown"
      >
        +
      </button>

      {/* Modal crear post */}
      {showCreatePost && (
        <div className="modal-overlay" onClick={() => setShowCreatePost(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CreatePost
              onPostCreated={() => {
                setShowCreatePost(false);
                handleReloadPosts(); // Recarga posts al crear uno nuevo
              }}
            />
          </div>
        </div>
      )}

      {/* Panel OpcionesPerfil */}
      {showOpciones && <OpcionesPerfil onClose={() => setShowOpciones(false)} />}
    </div>
  );
};

export default Home;