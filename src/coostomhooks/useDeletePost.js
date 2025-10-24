import Swal from "sweetalert2";

export const useDeletePost = () => {
  const deletePost = async (_id) => {
    try {
      const idString = _id?._id?.$oid || _id?._id || _id; 

      const res = await fetch(`/.netlify/functions/deletePost?id=${idString}`, {
        method: "DELETE",
        headers: {
          "x-api-key": process.env.REACT_APP_API_SECRET_KEY, 
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al eliminar post");

      return true;
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      throw error;
    }
  };

  return { deletePost };
};
