import { useState } from "react";

export const useEditUser = () => {
  const [loading, setLoading] = useState(false);

  const editUser = async (userData) => {
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/editUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_SECRET_KEY, 
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar usuario");

      return data;
    } catch (err) {
      console.error("editUser error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editUser, loading };
};
