import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  function login(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }
  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }
  return (
  <AuthContext.Provider
    value={{
        user,
        login,
        logout,
   }}
    >
    {children}
  </AuthContext.Provider>
  );
}
export default AuthProvider;
export function useAuth() {
  return useContext(AuthContext);
}