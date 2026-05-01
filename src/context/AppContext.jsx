import { createContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = '₹';
    // const backendUrl = "http://localhost:8080";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Local states
    const [doctors, setDoctors] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [authLoading, setAuthLoading] = useState(true);

    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: backendUrl,
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
        });

        // Add token to headers if it exists
        instance.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                config.headers.token = storedToken;
            }
            return config;
        });

        return instance;
    }, []);

    const fetchDoctors = async () => {
        const { data } = await api.get("/api/public/doctors");
        setDoctors(data?.data || []);
    };

    const fetchMe = async () => {
        if (!localStorage.getItem('token')) {
            setAuthLoading(false);
            return;
        }
        setAuthLoading(true);
        try {
            const me = await api.get("/api/me");
            setUser(me.data?.data || null);
        } catch (err) {
            setUser(null);
            localStorage.removeItem('token');
            setToken('');
        } finally {
            setAuthLoading(false);
        }
    };

    const login = async ({ email, password }) => {
        const { data } = await api.post("/api/auth/login", { email, password });
        if (data?.success && data?.token) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data?.data?.user || null);
        }
        return data;
    };

    const register = async ({ name, email, password, confirmPassword, role }) => {
        const { data } = await api.post("/api/auth/register", { name, email, password, confirmPassword, role });
        if (data?.success && data?.token) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data?.data?.user || null);
        }
        return data;
    };

    const logout = async () => {
        try {
            await api.post("/api/auth/logout");
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            localStorage.removeItem('token');
            setToken('');
            setUser(null);
        }
    };

    // Load data on start
    useEffect(() => {
        fetchDoctors();
        fetchMe();
    }, []);

    const value = {
        doctors,
        fetchDoctors,
        currencySymbol,
        backendUrl,
        api,
        user,
        setUser,
        token,
        setToken,
        authLoading,
        login,
        register,
        logout
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;