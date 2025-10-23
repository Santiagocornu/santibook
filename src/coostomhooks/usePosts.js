import { useState, useEffect } from 'react';

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/.netlify/functions/getPosts');
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
  };

  const addPost = async (title, content) => {
    try {
      await fetch('/.netlify/functions/addPost', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
      });
      fetchPosts(); 
    } catch (err) {
      setError('Error al añadir post');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  
  return { posts, loading, error, addPost, refetch: fetchPosts };
}