// coostomhooks/useDeletePost.js
import Swal from "sweetalert2";

export const useDeletePost = () => {
  const deletePost = async (_id) => {
    try {
      const res = await fetch(`/.netlify/functions/deletePost`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: _id }), 
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      return true;
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      throw error;
    }
  };

  return { deletePost };
};
