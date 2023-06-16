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
    setIsLoggedIn: () => { }, // Provide a default empty function
});

const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [state, action] = usePkSystemHook();
    useEffect(() => {
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
                console.log("AuthProvider - response.data.data.userId", response.data.data.userId);
                action.setUserId(response.data.data.userId);
                setIsLoggedIn(true);
                action.setModelOpen(false);
            } catch (error) {
                if (error instanceof AxiosError && error.response && error.response.status === 401) {
                    // Handle the 401 error
                    localStorage.removeItem("userToken"); // Clear the userToken from localStorage
                }
                setIsLoggedIn(false);
                // generate a random user id
                var randomId = Math.random().toString(36).substring(7);
                action.setUserId(randomId);
            }
        };

        checkAuthentication();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn}}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, useAuth };
export { };
