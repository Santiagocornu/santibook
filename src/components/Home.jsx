import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../db/firebase";
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import "../styles/globalStyles.css";
import "../styles/LoginStyles.css";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const items = ["Manzana", "Banana", "Naranja", "Pera", "Sandía", "Mango"];
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
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

  return (
    <div>
      {/* Mini Navbar */}
      <nav className="navbar">
  {/* Izquierda: avatar */}
  <div className="navbar-left">
    {/* futura imagen de usuario */}
  </div>

  {/* Centro: buscador */}
  <div className="navbar-center">
    <input
      type="text"
      placeholder="Buscar..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="input-white"
    />
  </div>

  {/* Derecha: botón login/logout */}
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
      <div style={{ padding: "20px", textAlign: "center" }}>
        {user && !user.isAnonymous && <p>Bienvenido {user.email}</p>}
        {user && user.isAnonymous && <p>Bienvenido invitado</p>}

        <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
          {filteredItems.map((item, index) => (
            <li key={index} style={{ margin: "5px 0" }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
