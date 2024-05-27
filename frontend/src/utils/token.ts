export const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const token = window.sessionStorage.getItem("token");
  return token && token.trim().length > 0 && token;
};
