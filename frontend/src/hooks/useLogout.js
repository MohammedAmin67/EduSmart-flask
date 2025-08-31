import { useNavigate } from "react-router-dom";
import API from "../api/axios.js";
import { toast } from "react-hot-toast";

function useLogout(setUser) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      if (setUser) setUser(null);
      toast.success("Logged out!");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return logout;
}
export default useLogout;