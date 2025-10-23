import { useState } from "react";
import { auth } from "../db/firebase";

export const useComentPost = () => {
  const [loading, setLoading] = useState(false);

  const comentPost = async ({ postId, content }) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al agregar comentario");
      }

      const result = await res.json();
      return result.comment;
    } finally {
      setLoading(false);
    }
  };

  return { comentPost, loading };
};
