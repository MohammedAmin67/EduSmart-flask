import API from "../api/axios.js";

export const useAvatarUpload = () => {
  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const { data } = await API.put("/users/me/avatar", formData);
      console.log("Avatar upload response:", data);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  };

  return uploadAvatar;
};