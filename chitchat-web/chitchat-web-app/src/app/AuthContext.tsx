import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ENDPOINT } from '../types/Env';
import axios, { AxiosError } from "axios";
import { usePkSystemHook } from '../state/pk-system-hook';
import UserRole from '../types/UserRole';

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
    if (state.user.role === UserRole.GUEST && state.user.id === 'unknown') {
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
            action.setUserId(response.data.data.user.id);
            action.setGender(response.data.data.user.gender);
            action.setUserName(response.data.data.user.username);
            action.setProfileBirthday(response.data.data.user.birthday);
            action.setProfileAvatar(response.data.data.user.profileUrl);
            action.setProfilePhoneNumber(response.data.data.user.phone);
            action.setUserRole(UserRole.USER); // TODO: store role in DB
            
            setIsLoggedIn(true);
            action.setIsLoggedIn(true);
            action.setModelOpen(false);
        } catch (error) {
            if (error instanceof AxiosError && error.response && error.response.status === 401) {
                // Handle the 401 error
                localStorage.removeItem("userToken"); // Clear the userToken from localStorage
            }
            setIsLoggedIn(false);
            action.setIsLoggedIn(false);
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

