import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('kurokami_token');
        if (token) {
            getMe()
                .then(res => setUser(res.data.user))
                .catch(() => {
                    localStorage.removeItem('kurokami_token');
                    localStorage.removeItem('kurokami_user');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const loginUser = (token, userData) => {
        localStorage.setItem('kurokami_token', token);
        localStorage.setItem('kurokami_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logoutUser = () => {
        localStorage.removeItem('kurokami_token');
        localStorage.removeItem('kurokami_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}
