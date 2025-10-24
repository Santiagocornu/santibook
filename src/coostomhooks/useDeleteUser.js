import Swal from "sweetalert2";

export const useDeleteUser = () => {
  const deleteUser = async (uid) => {
    try {
      const res = await fetch("/.netlify/functions/deleteUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_SECRET_KEY,
        },
        body: JSON.stringify({ uid }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al eliminar usuario");

      return true;
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      throw error;
    }
  };

  return { deleteUser };
};
