export function logoutUserOn401() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("force-logout"));
  
  // window.location.href = "/login";
}