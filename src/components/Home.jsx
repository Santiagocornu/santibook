import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../db/firebase";
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import "../styles/HomeStyles.css";
import Posts from "./Posts";
import CreatePost from "./CreatePost";
import OpcionesPerfil from "./OpcionesPerfil";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("todo");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showOpciones, setShowOpciones] = useState(false);

  
  const [appliedSearch, setAppliedSearch] = useState({
    term: "",
    filter: "todo",
  });

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

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          {user && !user.isAnonymous && (
            <img
              src={
                user.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
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
              className="search-filter"
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

            <button className="search-btn" onClick={handleApplySearch}>
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

      {/* Contenido */}
      <div className="home-welcome">
        {user && !user.isAnonymous && (
          <p>
            Bienvenido{" "}
            <strong>{user.displayName || user.email || "Usuario"}</strong>
          </p>
        )}
        {user && user.isAnonymous && <p>Bienvenido invitado</p>}
      </div>

      {/* 🔹 Ahora usa Posts con los filtros aplicados */}
      <Posts
        searchTerm={appliedSearch.term}
        filterBy={appliedSearch.filter}
      />

      {/* Modal de crear post */}
      {showCreatePost && (
        <div className="modal-overlay" onClick={() => setShowCreatePost(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CreatePost onPostCreated={() => setShowCreatePost(false)} />
          </div>
        </div>
      )}

      {/* Modal lateral de opciones */}
      {showOpciones && (
        <div className="side-overlay" onClick={() => setShowOpciones(false)}>
          <div className="side-panel" onClick={(e) => e.stopPropagation()}>
            <OpcionesPerfil onClose={() => setShowOpciones(false)} />
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setShowCreatePost(true)}
        className="floating-btn btn btn-brown"
      >
        +
      </button>
    </div>
  );
};

export default Home;
