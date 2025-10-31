// src/components/header/AuthAction.jsx

import { useHeaderContext } from "./HeaderContext";

export function AuthAction({ variant = "primary" }) {
    const { loading, isAuthenticated, handleGoogleLogin, handleLogout } = useHeaderContext();
    
    if (loading) {
        return <span className="text-sm text-gray-500">Checking auth...</span>;
    }

    const baseStyles = {
        primary: {
            login: "px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors",
            logout: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors",
        },
        link: {
            login: "w-full text-left text-indigo-600 hover:text-indigo-700",
            logout: "w-full text-left text-indigo-600 hover:text-indigo-700",
        },
    };

    if (isAuthenticated) {
        return (

            <button onClick={handleLogout} className={baseStyles[variant].logout}> Logout </button>
        
        );
    }

    return (

        <button onClick={handleGoogleLogin} className={baseStyles[variant].login}> Login with Google </button>
    
    );
}
