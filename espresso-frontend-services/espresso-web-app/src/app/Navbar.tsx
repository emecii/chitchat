import styled from 'styled-components'
import Logo from './Logo'
import { Link } from 'react-router-dom'
import { Button, Modal } from 'antd';
import { useState } from 'react';
import RegisterBlock from './RegisterBlock';

const Section = styled.section`
    padding: 20px;
    width: 95vw;
    background-color: ${props => props.theme.body}
`
const Navigation = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 75%;
    height: ${props => props.theme.navHeight};
    margin: 0 auto;
    
    .mobile{
       display: none;
    }

    @media (max-width: 64em) {
        .desktop{
        display: none;
    }
    .mobile{
        display: inline-block;
    }
}
`

const Menu = styled.ul`
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;


    @media (max-width: 64em) {
    /* 1024 px */

    position: relative;
    top: ${props => props.theme.navHeight};
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: ${props => `calc(100vh - ${props.theme.navHeight})`};
    z-index:50;
    background-color: ${props => `rgba(${props.theme.bodyRgba},0.85)`};
    backdrop-filter: blur(2px);

    transform: ${props => props.onClick ? 'translateY(0)' : `translateY(1000%)`};
    transition: all 0.3s ease;
    flex-direction: column;
    justify-content: center;

    touch-action: none;
    }    
`

const MenuItem = styled.li`
    margin: 0 4rem;
    padding-top: 1rem;
    color: ${props => props.theme.text};
    cursor: pointer;
    font-size: ${props => props.theme.fontlg};

    &::after{
    content: ' ';
    display: block;
    width: 0%;
    height: 2px;
    background: ${props => props.theme.text};
    transition: width 0.3s ease;
    }
    &:hover::after{
    width: 100%;
    }

    @media (max-width: 64em) {
    margin: 1rem 0;
    font-size: ${props => props.theme.fontmd};

    &::after{
    display: none;
    }
}
`

var console = require("console-browserify")

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');


    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };
    return (
        <Section>
            <Navigation>
                <Logo />
                <Menu>
                    <MenuItem><Link to={"/"} className="nav-link">主页</Link></MenuItem>
                    <MenuItem><Link to={"/pk"} className="nav-link">匹配</Link></MenuItem>
                    <MenuItem><Link to={"/chat"} className="nav-link">聊天</Link></MenuItem>
                </Menu>
                <Button type="primary" style={{ background: "black", color: "white" }} onClick={showModal}>
                    登录
                </Button>
                <Modal
                    centered
                    title="注册或登录"
                    open={open}
                    footer={null}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    /* 
                    okText={"登录"}
                    cancelText={"取消"}
                    onOk={handleOk}
                    okButtonProps={{style: {backgroundColor: "black"}}} */
                >
                    <RegisterBlock goToRegister={()=>{}}/>
                </Modal>
            </Navigation>
        </Section>
    )
}
                    /* 
                    <p>{modalText}</p> */
export default Navbar;