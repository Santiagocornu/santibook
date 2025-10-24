import { useState, useEffect, useCallback } from 'react';
import useApi from './useApi';
import { auth } from '../db/firebase';

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchWithAuth } = useApi(); 

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth('/.netlify/functions/getPosts'); 
      if (!res.ok) {
        throw new Error('Error al obtener posts');
      }
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  const addPost = async (title, content) => {
    try {
      const user = auth.currentUser; 
      if (!user) throw new Error("Usuario no autenticado");

      const postData = {
        uid: user.uid,
        displayName: user.displayName || "Usuario",
        photoURL: user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        title,
        content,
        type: "post", 
      };

      await fetchWithAuth('/.netlify/functions/addPost', { 
        method: 'POST',
        body: JSON.stringify(postData),
      });
      fetchPosts(); // Recarga posts
    } catch (err) {
      setError('Error al añadir post');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); 

  return { posts, loading, error, addPost, refetch: fetchPosts };
}
