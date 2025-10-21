import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        try {
            const userData = await authAPI.getProfile();
            setUser(userData);
            setError('');
        } catch (error) {
            setError(error.message || 'Error al cargar usuario');
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setError('');
            setLoading(true);
            
            const response = await authAPI.login(credentials);
            const { token, user } = response;
            
            setTimeout(() => {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setToken(token);
                setUser(user);
            }, 0);
            
            setError('');
            return response;
        } catch (error) {
            let errorMessage = 'Error en el login';
            
            if (error.code === 'CONNECTION_ERROR') {
                errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setError('');
            setLoading(true);
            
            const response = await authAPI.register(userData);
            const { token, user } = response;

            setTimeout(() => {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setToken(token);
                setUser(user);
            }, 0);
            
            setError('');
            return response;
        } catch (error) {
            let errorMessage = 'Error en el registro';
            if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setError('');
    };

    const updateProfile = async (profileData) => {
        try {
            const updatedUser = await authAPI.updateProfile(profileData);
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        loading,
        error,
        setError,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.rol === 'admin',
        isOrganizer: user?.rol === 'organizador' || user?.rol === 'admin',
        isUser: user?.rol === 'usuario' || user?.rol === 'organizador' || user?.rol === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};