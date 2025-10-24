import { useState } from "react";
import Swal from "sweetalert2";

export const useToggleFollower = () => {
  const [loading, setLoading] = useState(false);

  const toggleFollower = async (uid, followerUid) => {
    if (!uid || !followerUid) {
      Swal.fire("Error", "Faltan datos para seguir/dejar de seguir al usuario.", "error");
      return { success: false, isFollowing: null };
    }

    try {
      setLoading(true);

      const res = await fetch("/.netlify/functions/toggleFollower", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_SECRET_KEY, 
        },
        body: JSON.stringify({ uid, followerUid }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al seguir/dejar de seguir al usuario");

      const actionMessage = data.isFollowing
        ? "Ahora sigues a este usuario 🎉"
        : "Has dejado de seguir a este usuario";

      Swal.fire("Éxito", actionMessage, "success");

      return { success: true, isFollowing: data.isFollowing };
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      return { success: false, isFollowing: null };
    } finally {
      setLoading(false);
    }
  };

  return { toggleFollower, loading };
};
