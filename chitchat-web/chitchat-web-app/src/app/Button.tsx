import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';

const Btn = styled.button`
  white-space: nowrap;
  display: inline-block;
  background-color: ${(props) => props.theme.text};
  background: linear-gradient(89deg, #523dff 0%, #ff679e 100%);
  color: ${(props) => props.theme.body};
  outline: none;
  border: none;

  font-size: ${(props) => props.theme.fontmd};
  padding: 0.9rem 2.3rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  &:hover {
    transform: scale(0.9);
  }

  &::after {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 100%;
    height: 100%;
    border-radius: 50px;
    transition: all 0.2s ease;
  }

  &:hover::after {
    transform: translate(-50%, -50%) scale(1);
    padding-top: 2.5rem;
  }

  @media (max-width: 48em) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const Button = (props: {
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

export default Button;
