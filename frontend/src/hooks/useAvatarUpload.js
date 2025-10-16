import API from "../api/axios.js";

export const useAvatarUpload = () => {
  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const { data } = await API.put("/users/me/avatar", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("Avatar upload response:", data);
      
      // Update localStorage directly as backup
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, avatar: data.user.avatar };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return data.user; // Return the full user object
    } catch (error) {
      console.error("Error uploading avatar:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  };

  return uploadAvatar;
};