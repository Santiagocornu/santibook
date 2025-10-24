import { useState } from "react";
import { auth } from "../db/firebase";
import Swal from "sweetalert2";

export const useComentPost = () => {
  const [loading, setLoading] = useState(false);

  const comentPost = async ({ postId, content }) => {
    const user = auth.currentUser;
    if (!user) {
      Swal.fire("Error", "Usuario no autenticado", "error");
      throw new Error("Usuario no autenticado");
    }

    const commentData = {
      postId,
      uid: user.uid,
      displayName: user.displayName || "Usuario",
      photoURL: user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      content,
    };

    try {
      setLoading(true);

      const res = await fetch("/.netlify/functions/comentPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_SECRET_KEY,
        },
        body: JSON.stringify(commentData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al agregar comentario");

      return data.comment;
    } catch (err) {
      Swal.fire("Error", err.message, "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { comentPost, loading };
};
