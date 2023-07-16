import React from 'react';
import styled from "styled-components";
import Navbar from "../app/Navbar";
import Footer from "../app/Footer";
import backgroundJPG from '../assets/BGIWithoutCharacter.png';

const Section = styled.section`
min-height: ${props => `calc(110vh - ${props.theme.navHeight})`};
width: 100vw;
position: relative;
background: url(${backgroundJPG}) no-repeat center center;
background-size: cover;
`;

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
    return (
        <Section>
            <Navbar />
            {children}
            <Footer />
        </Section>
    );
};

export default PageLayout;