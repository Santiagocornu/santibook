import { useState, useEffect } from "react";

export const useChatById = (id) => {
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchChat = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/.netlify/functions/getChatBy_id?id=${id}`, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_SECRET_KEY,
          },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al obtener el chat");
        }
        const data = await res.json();
        setChat(data);
      } catch (err) {
        console.error("Error en useChatById:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [id]);

  return { chat, loading, error };
};
