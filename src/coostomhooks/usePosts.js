import { useState, useEffect } from 'react';

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch('/.netlify/functions/getPosts');
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  const addPost = async (title, content) => {
    await fetch('/.netlify/functions/addPost', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    });
    fetchPosts(); 
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, addPost };
}
