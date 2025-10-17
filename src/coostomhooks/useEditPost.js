import Swal from "sweetalert2";

export const useEditPost = () => {
  const editPost = async ({ id, title, content, editado = true }) => {
    try {
      const res = await fetch(`/.netlify/functions/editPost`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, content, editado }),
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

  return { editPost };
};
