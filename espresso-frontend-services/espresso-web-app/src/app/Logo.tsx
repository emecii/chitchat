import React from 'react'
import styled from 'styled-components'
import "@fontsource/zcool-kuaile"
import logo from '../assets/temporary-logo.png';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 2.5em;
  margin-right: 0.5em;
`;

const LogoText = styled.h1`
font-family: "ZCOOL KuaiLe", sans-serif; 
font-size: 2.5em;
color: ${props => props.theme.text};
transition: all 0.2s ease;
&:hover {
    transform: scale(1.1);
}
`
export const Logo = () => {
    return (
        <LogoContainer>
            <LogoImage src={logo} alt="Logo" />
            <LogoText>七洽</LogoText>
        </LogoContainer>
    )
}

export default Logo;