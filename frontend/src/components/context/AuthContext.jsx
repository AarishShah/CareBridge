import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token); 
        setLoading(false);  
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const logout = useCallback((navigate) => {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        navigate('/'); 
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {!loading && children}  // Only render children when not loading
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
