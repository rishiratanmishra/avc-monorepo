"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRoleCode =
  | "pet_owner"
  | "veterinarian"
  | "receptionist"
  | "staff"
  | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRoleCode;
  phone?: string;
  avatarUrl?: string;
  petName?: string;
  petSpecies?: string;
  campus?: string;
}

export const DEMO_USERS: Record<UserRoleCode, AuthUser> = {
  pet_owner: {
    id: "user-pet-owner-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    role: "pet_owner",
    phone: "+91 98765 43210",
    petName: "Bruno",
    petSpecies: "Golden Retriever (Dog)",
    campus: "Sector 90 Hospital",
  },
  veterinarian: {
    id: "user-vet-1",
    name: "Dr. Hardeep Beniwal",
    email: "dr.hardeep@avcpethospital.com",
    role: "veterinarian",
    phone: "+91 99900 70026",
    campus: "Sector 90 Hospital (Surgery & ICU)",
  },
  receptionist: {
    id: "user-reception-1",
    name: "Neha Verma",
    email: "reception@avcpethospital.com",
    role: "receptionist",
    phone: "+91 99900 70026",
    campus: "Sector 90 Front Desk",
  },
  staff: {
    id: "user-staff-1",
    name: "Vikram Singh",
    email: "staff@avcpethospital.com",
    role: "staff",
    phone: "+91 74500 28000",
    campus: "Sector 87 Pet World Resort",
  },
  admin: {
    id: "user-admin-1",
    name: "Hospital Administrator",
    email: "admin@avcpethospital.com",
    role: "admin",
    phone: "+91 99900 70026",
    campus: "All Campuses (Admin HQ)",
  },
};

export const getPanelPath = (role: UserRoleCode): string => {
  switch (role) {
    case "pet_owner":
      return "/portal/pet-owner";
    case "veterinarian":
      return "/portal/doctor";
    case "receptionist":
      return "/portal/reception";
    case "staff":
      return "/portal/staff";
    case "admin":
      return "/portal/admin";
    default:
      return "/portal/pet-owner";
  }
};

export const getRoleLabel = (role: UserRoleCode): string => {
  switch (role) {
    case "pet_owner":
      return "Pet Parent";
    case "veterinarian":
      return "Veterinary Doctor";
    case "receptionist":
      return "Receptionist";
    case "staff":
      return "Resort Staff";
    case "admin":
      return "Administrator";
    default:
      return "User";
  }
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, preferredRole?: UserRoleCode) => Promise<boolean>;
  signup: (userData: Omit<AuthUser, "id">, password?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRoleCode) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "avc_auth_session_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage read errors
    }
    setMounted(true);
  }, []);

  const saveUserSession = (userObj: AuthUser | null) => {
    setUser(userObj);
    try {
      if (userObj) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userObj));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // Ignore localStorage write errors
    }
  };

  const login = async (
    email: string,
    _password?: string,
    preferredRole?: UserRoleCode
  ): Promise<boolean> => {
    // Check if email matches one of our demo users
    const normalizedEmail = email.trim().toLowerCase();
    let matchedUser: AuthUser | undefined;

    for (const key of Object.keys(DEMO_USERS) as UserRoleCode[]) {
      if (DEMO_USERS[key].email.toLowerCase() === normalizedEmail) {
        matchedUser = DEMO_USERS[key];
        break;
      }
    }

    if (!matchedUser) {
      // If role specified or fallback to pet_owner
      const role = preferredRole || "pet_owner";
      matchedUser = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0] || "Valued User",
        email: normalizedEmail,
        role,
        campus:
          role === "staff"
            ? "Sector 87 Pet World"
            : "Sector 90 Hospital",
      };
    }

    saveUserSession(matchedUser);
    router.push(getPanelPath(matchedUser.role));
    return true;
  };

  const signup = async (
    userData: Omit<AuthUser, "id">,
    _password?: string
  ): Promise<boolean> => {
    const newUser: AuthUser = {
      ...userData,
      id: `user-${Date.now()}`,
    };

    saveUserSession(newUser);
    router.push(getPanelPath(newUser.role));
    return true;
  };

  const logout = () => {
    saveUserSession(null);
    router.push("/");
  };

  const switchRole = (role: UserRoleCode) => {
    const demoUser = DEMO_USERS[role];
    if (demoUser) {
      saveUserSession(demoUser);
      router.push(getPanelPath(demoUser.role));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
