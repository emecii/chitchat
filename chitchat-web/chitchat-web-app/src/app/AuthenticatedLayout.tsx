import React from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../app/Navbar';
import Footer from '../app/Footer';
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
  if (!isLoggedIn) {
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
