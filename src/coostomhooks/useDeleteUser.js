import Swal from "sweetalert2";

export const useDeleteUser = () => {
  const deleteUser = async (uid) => {
    try {
      const res = await fetch("/.netlify/functions/deleteUser", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
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

  return { deleteUser };
};
