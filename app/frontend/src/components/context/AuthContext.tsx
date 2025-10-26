"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define only the allowed roles
export type UserRole = "admin" | "user";

// Define the shape of your auth context
interface AuthContextType {
  role: UserRole;
  // setRole: (role: UserRole) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context Provider
export const AuthProvider: React.FC<{ children: React.ReactNode; role: UserRole; }> = ({ children, role }) => {
  // const [role, setRole] = useState<UserRole>("admin"); // default to trainer

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {

    setHasMounted(true);
  }, []);
  

  // ✅ Avoid rendering until client is ready
  if (!hasMounted) return null;
  return (
    <AuthContext.Provider value={{ role }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access the current role
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
