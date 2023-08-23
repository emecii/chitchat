import React from 'react';
import styled from 'styled-components';

const Btn = styled.button`
  display: inline-block;
  background-color: #523dff;
  color: ${(props) => props.theme.text};
  outline: none;
  border: none;
  gap: 16px;
  font-weight: 600;
  font-size: ${(props) => props.theme.fontlg};
  padding: 16px 48px;
  border-radius: 71px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  @media (max-width: 48em) {
    padding: 1rem 2rem;
  }
  @media (max-width: 30em) {
    padding: 0.5rem 2rem;
    font-size: ${(props) => props.theme.fontsm};
  }
  &:hover {
    transform: scale(0.9);
  }

  &::after {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    border: 2px solid ${(props) => props.theme.body};
    width: 100%;
    height: 100%;
    border-radius: 50px;
    transition: all 0.2s ease;
  }

  &:hover::after {
    transform: translate(-50%, -50%) scale(1);
    padding: 0.3rem;
  }
`;

const BlueButton = (props: {
  text: string;
  link?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const { text, link = '#!', onClick, disabled } = props;
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault(); // Prevent default behavior when an onClick function is provided
      onClick();
    }
  };

  return (
    <a href={link} target="_blank" rel="noreferrer" onClick={handleClick}>
      <Btn disabled={disabled}>{text}</Btn>
    </a>
  );
};

export default BlueButton;
