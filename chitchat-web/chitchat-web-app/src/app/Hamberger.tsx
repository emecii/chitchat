// Hamburger.tsx
import React, { FC } from 'react';
import styled from 'styled-components';

interface HamburgerButtonProps {
  isOpen: boolean;
  theme: {
    text: string;
  };
}

const HamburgerButton = styled.button<HamburgerButtonProps>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  box-sizing: border-box;
  width: 2rem;
  height: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  div {
    width: 100%;
    height: 0.25rem;
    background-color: ${(props) => props.theme.text};
    border-radius: 10px;
    transform-origin: 1px;
    transition: all 0.3s linear;

    &:nth-child(1) {
      transform: ${(props) => (props.isOpen ? 'rotate(45deg)' : 'rotate(0)')};
    }

    &:nth-child(2) {
      opacity: ${(props) => (props.isOpen ? '0' : '1')};
      transform: ${(props) =>
        props.isOpen ? 'translateX(20px)' : 'translateX(0)'};
    }

    &:nth-child(3) {
      transform: ${(props) => (props.isOpen ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`;

interface HamburgerProps {
  onClick: () => void;
  isOpen: boolean;
}

const Hamburger: FC<HamburgerProps> = ({ onClick, isOpen }) => {
  return (
    <HamburgerButton onClick={onClick} isOpen={isOpen}>
      <div />
      <div />
      <div />
    </HamburgerButton>
  );
};

export default Hamburger;
