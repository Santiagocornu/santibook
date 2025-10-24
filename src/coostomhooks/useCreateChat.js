import { useState } from "react";
import Swal from "sweetalert2";

export const useCreateChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createChat = async (uids) => {
    if (!uids || uids.length !== 2) {
      Swal.fire("Error", "Se requieren exactamente dos UIDs para crear un chat.", "error");
      throw new Error("Se requieren exactamente dos UIDs para crear un chat.");
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/.netlify/functions/createChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_SECRET_KEY,
        },
        body: JSON.stringify({ uid1: uids[0], uid2: uids[1] }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear el chat');

      return data; // { message, chatId } o { message, chat }
    } catch (err) {
      setError(err.message);
      Swal.fire("Error", err.message, "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createChat, loading, error };
};
