import { useNavigate } from "react-router-dom";
import API from "../api/axios.js";
import { toast } from "react-hot-toast";

function useLogout(setUser) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("token"); // Changed from "authToken"
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      if (setUser) setUser(null);
      toast.success("Logged out!");
      navigate("/");
    } catch (error) {
      // Even if API fails, clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      if (setUser) setUser(null);
      console.error("Logout error:", error);
      toast.error("Logout failed, but cleared local session.");
      navigate("/");
    }
  };

  return logout;
}
export default useLogout;