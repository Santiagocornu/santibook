import Swal from "sweetalert2";

export const useEditPost = () => {
  const editPost = async ({ id, title, content, editado = true }) => {
    try {
      const res = await fetch(`/.netlify/functions/editPost`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_SECRET_KEY, 
        },
        body: JSON.stringify({ id, title, content, editado }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar post");

      return true;
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      throw error;
    }
  };

  return { editPost };
};
