import API from "../api/axios.js";

export const useAvatarUpload = () => {
  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      // Get token explicitly
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("❌ No token found in localStorage");
        throw new Error("No authentication token found. Please login again.");
      }

      console.log("📤 Uploading avatar...", {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        hasToken: !!token
      });

      // Make request - DON'T set Content-Type for FormData
      const { data } = await API.put("/users/me/avatar", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Let browser set Content-Type with boundary automatically
        },
      });
      
      console.log("✅ Avatar upload successful:", data);
      
      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, avatar: data.user.avatar };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return data.user;
    } catch (error) {
      console.error("❌ Error uploading avatar:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      
      // If unauthorized, clear storage and redirect
      if (error.response?.status === 401) {
        console.log("🔒 Unauthorized - clearing localStorage and redirecting...");
        localStorage.clear();
        window.location.href = "/login";
      }
      
      throw error;
    }
  };

  return uploadAvatar;
};