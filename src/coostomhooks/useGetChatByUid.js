import { useEffect, useState } from "react";

export const useGetChatByUid = (uid) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/.netlify/functions/getChatByUid?uid=${encodeURIComponent(uid)}`, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_SECRET_KEY,
          },
        });
        if (!res.ok) throw new Error("Error fetching chats");

        const data = await res.json();
        setChats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [uid]);

  return { chats, loading, error };
};
