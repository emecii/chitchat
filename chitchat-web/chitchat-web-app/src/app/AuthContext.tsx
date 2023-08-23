import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { ENDPOINT } from '../types/Env';
import axios, { AxiosError } from 'axios';
import { usePkSystemHook } from '../state/pk-system-hook';
import UserRole from '../types/UserRole';
import Loading from './Loading';

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsLoggedIn: () => {},
});

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [state, action] = usePkSystemHook();

  if (state.user.role === UserRole.GUEST && state.user.id === 'unknown') {
    // get a random user id and set it to the state
    const randomId = Math.random().toString(36).substring(7);
    action.setUserId(randomId);
  }

  const checkAuthentication = async () => {
    try {
      const userToken = localStorage.getItem('userToken'); // Get the userToken from localStorage
      if (!userToken) {
        setIsLoggedIn(false);
        action.setModelOpen(true);
        setLoading(false);
        return;
      }
      const response = await axios.get(`${ENDPOINT}/api/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`, // Add the Authorization header here
        },
        timeout: 5000, // Set timeout to 5000 milliseconds (5 seconds)
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
      setLoading(false);
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 401
      ) {
        // Handle the 401 error
        localStorage.removeItem('userToken'); // Clear the userToken from localStorage
      }
      setIsLoggedIn(false);
      action.setIsLoggedIn(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
export {};
