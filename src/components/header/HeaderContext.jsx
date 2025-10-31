// src/components/header/HeaderContext.jsx

import { createContext, useContext, useState } from "react";
import { useAuthStatus } from "../../hooks/useAuthStatus";

const HeaderContext = createContext();
export const useHeaderContext = () => useContext(HeaderContext);

export function HeaderProvider({ children }) {

    const { loading, isAuthenticated } = useAuthStatus();
    const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

    const [menuOpen, setMenuOpen] = useState(false);

    const handleGoogleLogin = () => {
    window.location.href = `${baseUrl}/auth/google`;
    };

    const handleLogout = async () => {
        try {
            await fetch(`${baseUrl}/auth/logout`, {
            method: "POST",
            credentials: "include",
            });
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            localStorage.removeItem("userEmail");
            window.location.href = "/";
        }
    };

    return (

        <HeaderContext.Provider value={{ loading, isAuthenticated, handleGoogleLogin, handleLogout, menuOpen, setMenuOpen}}>
            { children }
        </HeaderContext.Provider>

    );
}