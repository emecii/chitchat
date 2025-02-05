import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';
import Logo from './Logo';

import Facebook from '../assets/Icons/Instagram';
import Instagram from '../assets/Icons/Twitter';
import Twitter from '../assets/Icons/Facebook';
import LinkedIn from '../assets/Icons/LinkedIn';
import Loading from './Loading';

const Banner = lazy(() => import('./Banner'));

const Section = styled.section`
  min-height: 60vh;
  width: 100vw;
  background: linear-gradient(180deg, rgba(38, 37, 55, 1) 0%, #262537 100%);
  position: relative;
  color: ${(props) => props.theme.text};

  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
  flex-direction: column;
`;

const Container = styled.div`
  width: 75%;
  margin: 2rem auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${(props) => props.theme.fontlg};

  border-bottom: 1px solid ${(props) => props.theme.text};

  @media (max-width: 48em) {
    width: 90%;

    h1 {
      font-size: ${(props) => props.theme.fontxxxl};
    }
  }
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 48em) {
    width: 100%;
  }
`;

const IconList = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem auto;

  & > * {
    padding-right: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
`;
const MenuItems = styled.ul`
  list-style: none;
  width: 50%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 1rem;

  @media (max-width: 48em) {
    display: none;
  }
`;
const Item = styled.li`
  width: fit-content;
  cursor: pointer;

  &::after {
    content: ' ';
    display: block;
    width: 0%;
    height: 2px;
    background: ${(props) => props.theme.text};
    transition: width 0.3s ease;
  }
  &:hover::after {
    width: 100%;
  }
`;

const Bottom = styled.div`
  width: 75%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${(props) => props.theme.fontlg};

  a {
    text-decoration: underline;
  }
  @media (max-width: 48em) {
    flex-direction: column;
    width: 100%;
    font-size: ${(props) => props.theme.fontmd};

    span {
      margin-bottom: 1rem;
    }
  }
`;

const Footer = () => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);

    if (element)
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
  };

  return (
    <Section>
      <Suspense fallback={<Loading />}>
        <Banner />{' '}
      </Suspense>
      <Container>
        <Left>
          <Logo />
          <IconList>
            <a
              href="http://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="facebook"
            >
              <Facebook />
            </a>
            <a
              href="https://www.instagram.com/code.bucks/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="instagram"
            >
              <Instagram />
            </a>
            <a
              href="https://twitter.com/code_bucks"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="twitter"
            >
              <Twitter />
            </a>
            <a
              href="http://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="linkedin"
            >
              <LinkedIn />
            </a>
          </IconList>
        </Left>
        <MenuItems>
          <Item onClick={() => scrollTo('home')}>主页</Item>
          <Item onClick={() => scrollTo('about')}>匹配</Item>
          <Item onClick={() => scrollTo('roadmap')}>聊天</Item>
          <Item onClick={() => scrollTo('showcase')}>探索</Item>
        </MenuItems>
      </Container>
      <Bottom>
        <span>&copy; {new Date().getFullYear()} 柒洽.</span>
      </Bottom>
    </Section>
  );
};

export default Footer;
