// useUser.js
import { useState, useEffect } from "react";

export const useUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/.netlify/functions/getUser`, {
        headers: {
          "x-api-key": process.env.REACT_APP_API_SECRET_KEY, 
        },
      });

      if (!res.ok) throw new Error("Error al obtener usuarios");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};
