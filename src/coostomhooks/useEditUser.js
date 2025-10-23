import { useState } from "react";

export const useEditUser = () => {
  const [loading, setLoading] = useState(false);

  const editUser = async (userData) => {
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/editUser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData), // aquí userData puede incluir bio
      });

      if (!res.ok) throw new Error("Error al actualizar usuario");
      return await res.json();
    } catch (err) {
      console.error("editUser error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editUser, loading };
};
