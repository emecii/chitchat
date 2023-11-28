import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './app/styles/GlobalStyles';
import { light } from './app/styles/Themes';
import Home from './components/home.component';
import Chat from './components/chat.component';
import Forum from './components/forum.component';
import MyBot from './components/myBot.component';
import { AuthProvider } from './app/AuthContext';
import NotFound from './components/notFound';
import { logPageView, initialize } from './app/GaEvent';
import { usePkSystemHook } from './state/pk-system-hook';
import Register from './components/register.component';
import ProfileUpdate from './components/profileUpdate.component';
import Login from './components/login.component';
import Sanofi from './components/sanofi.component';

const App: React.FC = () => {
  const location = useLocation();
  const [state] = usePkSystemHook();

  useEffect(() => {
    initialize();
    logPageView(location.pathname);
  }, [location, state.modalOpen]);

  return (
    <div>
      <GlobalStyles />
      <ThemeProvider theme={light}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index" element={<Home />} />
          <Route path="/chat/:modelIdLink?" element={<Chat />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/mybot" element={<MyBot />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sanofi" element={<Sanofi />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profileUpdate"
            element={
              <ProfileUpdate
                user_id={state.user.id}
                profile={state.user.profile}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
};

// Wrap App component with AuthProvider
const WrappedApp: React.FC = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default WrappedApp;
