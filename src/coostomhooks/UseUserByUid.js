import { useState, useEffect } from "react";

export const useUserByUid = (uid) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const encodedUid = encodeURIComponent(uid);
        const res = await fetch(`/.netlify/functions/getUserByUid?uid=${encodedUid}`, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_SECRET_KEY, 
          },
        });
        if (!res.ok) throw new Error("Error al obtener usuario");
        const data = await res.json();
        console.log("Datos del usuario obtenidos:", data);
        setUser(data);
      } catch (err) {
        console.error("Error en fetchUser:", err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [uid]);

  return { user, loading, error };
};
