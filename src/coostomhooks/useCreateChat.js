import { useState } from "react";

export const useCreateChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createChat = async (uids) => {
    if (!uids || uids.length !== 2) {
      throw new Error("Se requieren exactamente dos UIDs para crear un chat.");
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/.netlify/functions/createChat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid1: uids[0], uid2: uids[1] }), 
    });
      if (!res.ok) throw new Error('Error al crear el chat');
      const data = await res.json();
      return data; 
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createChat, loading, error };
};