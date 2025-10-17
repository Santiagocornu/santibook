import Swal from "sweetalert2";

export const useDeletePost = () => {
  const deletePost = async (_id) => {
    try {
      const idString = _id?.$oid || _id;

      const res = await fetch(`/.netlify/functions/deletePost?id=${idString}`, {
        method: "DELETE",
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
