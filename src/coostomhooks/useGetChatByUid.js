// src/coostomhooks/useGetChatByUid.js
import { useEffect, useState } from "react";

export const useGetChatByUid = (uid) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/.netlify/functions/getChatByUid?uid=${uid}`);
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
