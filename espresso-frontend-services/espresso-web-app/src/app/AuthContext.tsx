import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ENDPOINT } from '../types/Env';
import axios, { AxiosError } from "axios";
import { usePkSystemHook } from '../state/pk-system-hook';

interface AuthState {
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    setIsLoggedIn: () => { },
});

const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [state, action] = usePkSystemHook();
    if (state.userId === "unknown") {
        // get a random user id and set it to the state
        var randomId = Math.random().toString(36).substring(7);
        action.setUserId(randomId);
    }
    const checkAuthentication = async () => {
        try {
            const userToken = localStorage.getItem('userToken'); // Get the userToken from localStorage
            if (!userToken) {
                setIsLoggedIn(false);
                action.setModelOpen(true);
                return;
            }
            const response = await axios.get(`${ENDPOINT}/api/auth/me`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`, // Add the Authorization header here
                },
            });
            // set user info
            action.setUserId(response.data.data.userId);
            action.setGender(response.data.data.gender);
            action.setUserName(response.data.data.userName);
            
            setIsLoggedIn(true);
            action.setModelOpen(false);
        } catch (error) {
            if (error instanceof AxiosError && error.response && error.response.status === 401) {
                // Handle the 401 error
                localStorage.removeItem("userToken"); // Clear the userToken from localStorage
            }
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, useAuth };
export { };

