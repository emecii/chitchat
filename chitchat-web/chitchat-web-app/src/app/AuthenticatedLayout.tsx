import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styled from "styled-components";
import Navbar from "../app/Navbar";
import Footer from "../app/Footer";
import backgroundJPG from '../assets/BGIWithoutCharacterCompressed.jpg';
import { useAuth } from './AuthContext';

const Section = styled.section`
  min-height: ${(props) => `calc(110vh - ${props.theme.navHeight})`};
  width: 100vw;
  position: relative;
  background: url(${backgroundJPG}) no-repeat center center;
  background-size: cover;
`;

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
    const { isLoggedIn } = useAuth();
    const allowedModelId = ['ovo0SqW3SS'];
    const location = useLocation();
    const isAllowedChatPath = allowedModelId.some(id => location.pathname === `/chat/${id}`);
    // If the user is not logged in and the current path is not one of the allowed chat paths, navigate them to the login page
    if (!isLoggedIn && !isAllowedChatPath) {
        return <Navigate to="/login" />;
    }

  return (
    <Section>
      <Navbar />
      {children}
      <Footer />
    </Section>
  );
};

export default AuthenticatedLayout;
