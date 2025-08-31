import React, { createContext, useContext, useState, useEffect } from "react";
import { userData as mockUserData } from "../../data/mockData";
import { useAvatarUpload } from "../../hooks/useAvatarUpload";
import API from "../../api/axios"; 

const UserContext = createContext();

function mergeUserWithMock(user) {
  if (!user) return null;
  return {
    ...mockUserData,
    ...user,
    stats: { ...mockUserData.stats, ...(user.stats || {}) }
  };
}

export const UserProvider = ({ children }) => {
  const [user, setUserRaw] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return mergeUserWithMock(savedUser ? JSON.parse(savedUser) : null);
  });

  // Listen for force-logout event from axios interceptor
  useEffect(() => {
    const handleForceLogout = () => setUser(null);
    window.addEventListener("force-logout", handleForceLogout);
    return () => window.removeEventListener("force-logout", handleForceLogout);
  }, []);

  // This is your setUser function
  const setUser = (u) => {
    const merged = mergeUserWithMock(u);
    setUserRaw(merged);
    if (merged) localStorage.setItem("user", JSON.stringify(merged));
    else localStorage.removeItem("user");
  };

  useEffect(() => {
    // Only run if a user is present (localStorage or state)
    if (!user) return;
    const checkSession = async () => {
      try {
        const res = await API.get("/users/me");
        setUser(res.data); // update with fresh user from server
      } catch (err) {
        setUser(null); // clear user if 401 or error
        localStorage.removeItem("user");
      }
    };
    checkSession();
    // eslint-disable-next-line
  }, []);

  const uploadAvatar = useAvatarUpload();

  const updateAvatar = async (file) => {
    try {
      const updatedData = await uploadAvatar(file); 
      if (!updatedData) throw new Error("No data from avatar upload");
      setUser(updatedData); 
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);