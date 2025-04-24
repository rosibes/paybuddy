import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Funția de logout
    const logout = () => {
        // Șterge tokenul și userId din localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        // Resetează utilizatorul în context
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        axios.get(`${BACKEND_URL}/api/v1/user/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setUser(res.data);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);
            }) //@ts-ignore
            .finally(() => setLoading(false));
    }, []);

    // Redefinirea valorii contextului, includem și logout
    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
