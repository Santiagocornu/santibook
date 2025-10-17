import { useEffect, useState } from "react";

export const useUserPosts = (uid) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/.netlify/functions/getPostsByUid?uid=${uid}`);
        if (!res.ok) throw new Error("Error al obtener los posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [uid]);

  return { posts, loading, error };
};
