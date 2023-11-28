import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Spin,
  Row,
  Col,
  Dropdown,
  MenuProps,
  Space,
} from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';
import { HttpStatus } from '../../types/HttpStatus';
import { usePkSystemHook } from '../../state/pk-system-hook';
import { ENDPOINT } from '../../types/Env';
import { useAuth } from '../../app/AuthContext';
import { useRedirectToNewPage } from '../../util/redirectToNewPage';

const console = require('console-browserify');

const items: MenuProps['items'] = [
  {
    label: '中国 +86',
    key: '1',
    icon: <UserOutlined />,
  },
];

// Form validation rules
const rules = {
  userName: [{ required: true, message: '请输入昵称' }],
  dob: [{ required: true, message: '请输入生日' }],
  gender: [{ required: true, message: '请输入性别' }],
  phoneNumber: [{ required: true, message: '请输入电话号码' }],
};

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  width: 100vw;
`;

const LoginFormWrapper = styled.div`
  color: white;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 10px;
  .ant-input {
    color: white !important;
    background: radial-gradient(
        100% 100% at 50% 0%,
        rgba(255, 133, 133, 0.2) 0%,
        rgba(255, 133, 133, 0) 100%
      ),
      rgba(255, 255, 255, 0.05) !important;
  }
  .ant-form-item-explain {
    text-align: left;
    font-size: 13px;
  }
  .footer-btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: auto;
    width: 100%;
  }
  .login-section {
    margin-top: 2rem;
    margin-left: 0.7rem;
  }
  .login-form-codetext-button {
    min-width: 100px;
    color: white;
    background: radial-gradient(
        100% 100% at 50% 0%,
        rgba(255, 133, 133, 0.2) 0%,
        rgba(255, 133, 133, 0) 100%
      ),
      rgba(255, 255, 255, 0.05);
  }
  .login-form-submit-button {
    background: linear-gradient(
      89deg,
      rgb(82, 61, 255) 0%,
      rgb(255, 103, 158) 100%
    );
  }
  .login-form-register-button {
    margin-right: 10px;
    background-color: rgb(82, 61, 255);
  }
`;

const DarkButton = styled(Button)`
  background: radial-gradient(
      100% 100% at 50% 0%,
      rgba(255, 133, 133, 0.2) 0%,
      rgba(255, 133, 133, 0) 100%
    ),
    rgba(255, 255, 255, 0.05);
  color: white;

  &:hover {
    color: white;
    background: rgb(82, 61, 255);
  }
`;

const DarkDropdown = styled(Dropdown)`
  .ant-dropdown-menu {
    background-color: rgba(255, 133, 133, 0.2);
    color: white;
  }

  .ant-dropdown-menu-item {
    color: white;

    &:hover {
      background-color: rgb(82, 61, 255);
    }
  }
`;

const LoginPage = () => {
  const [state, action] = usePkSystemHook();
  const { setIsLoggedIn } = useAuth();
  const [isGettingCapcha, setIsGettingCapcha] = useState(false);

  // Jump to register page
  const showRegisterPage = () => {
    redirectToNewPage('/register');
  };

  const [form] = Form.useForm();
  // const dispatch = useDispatch()
  //const history = useHistory();
  const [loading, setLoading] = useState(false);

  let time = 60,
    timer: any;
  const [codetext, setCodeText] = useState<any>('获取验证码');

  const [country, setCountry] = useState<string>('+86');

  const redirectToNewPage = useRedirectToNewPage();

  const onLogin = async (phone: string, code: string) => {
    await axios
      .post(`${ENDPOINT}/api/auth/verify`, {
        otp: code,
        phone: phone,
      })
      .then((response) => {
        if (
          response.status === HttpStatus.OK ||
          response.status === HttpStatus.CREATED
        ) {
          const userToken = response.data.data.token;
          localStorage.setItem('userToken', userToken);
          const uID = response.data.data.userId;
          action.setUserId(uID);
          setLoading(false);
          // Set the isLoggedIn state to true
          setIsLoggedIn(true);
          // Fetching user profile data and store to front end state
          action.fetchUserProfile(uID);
          // Jump to forum page
          redirectToNewPage('/forum');
        } else {
          setLoading(false);
          message.error('手机号或验证码有误，请重试');
        }
      })
      .catch((err) => {
        setLoading(false);
        message.error(
          '手机号或验证码有误，请稍后重试或添加下方微信群联系管理员。',
        );
        console.log(err);
      });
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const console = require('console-browserify');
    if (e.key == '2') {
      setCountry('+1');
    } else {
      setCountry('+86');
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const onFinish = (values: any) => {
    const data = {
      phoneNumber: values.phone,
      verifyCode: values.verifyCode,
    };
    setLoading(true);
    onLogin(data.phoneNumber, data.verifyCode);
  };

  const getCapcha = async () => {
    if (isGettingCapcha) {
      return;
    }

    setIsGettingCapcha(true);
    await form.validateFields(['phone']);
    const data = {
      operationType: 'login',
      phoneNumber: form.getFieldsValue().phone,
    };
    await axios
      .post(`${ENDPOINT}/api/auth/login_with_otp`, {
        phone: data.phoneNumber,
      })
      .then((response) => {
        if (
          response.status === HttpStatus.OK ||
          response.status === HttpStatus.CREATED
        ) {
          message.success('验证码发送成功，请注意查收');
        } else if (response.status === HttpStatus.FORBIDDEN) {
          message.error('验证码发送过于频繁，请稍后再试');
        } else {
          message.error(
            '验证码发送失败，请稍后重试或添加下方微信群联系管理员。',
          );
        }
      })
      .catch((err) => {
        if (err.response.status === HttpStatus.FORBIDDEN) {
          message.error('验证码发送过于频繁，请稍后再试');
        } else if (err.response.data.message) {
          message.error(err.response.data.message);
        } else {
          message.error(
            '验证码发送失败，请稍后重试或添加下方微信群联系管理员。',
          );
        }
      });
    timer = setInterval(() => {
      time--;
      setCodeText(time);
      if (time === 0 && timer) {
        clearInterval(timer);
        setCodeText('获取验证码');
        timer = 60;
        setIsGettingCapcha(false);
      }
    }, 1000);
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error('请完成校验再登录', errorInfo);
  };

  useEffect(() => {
    return (): void => {
      clearInterval(timer);
    };
  }, [timer]);

  return (
    <PageWrapper>
      <LoginFormWrapper>
        <p>登录账号以保存聊天记录并解锁所有功能。未注册请先注册哦~</p>
        <section className="login-section">
          {!loading ? (
            <Form
              name="basic"
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item label="手机号">
                <Row gutter={55}>
                  <Col xs={7} sm={5}>
                    <DarkDropdown menu={menuProps}>
                      <DarkButton>
                        <Space>
                          {country}
                          <DownOutlined />
                        </Space>
                      </DarkButton>
                    </DarkDropdown>
                  </Col>
                  <Col span={16}>
                    <Form.Item
                      noStyle
                      name="phone"
                      rules={[{ required: true, message: '请输入电话号码' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item label="验证码">
                <Row gutter={8}>
                  <Col span={14}>
                    <Form.Item
                      name="verifyCode"
                      noStyle
                      rules={[{ required: true, message: '请先获取验证码' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Button
                      disabled={codetext !== '获取验证码'}
                      onClick={getCapcha}
                      className="login-form-codetext-button"
                    >
                      {codetext}
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
              <div className="footer-btn">
                <Button
                  type="primary"
                  onClick={showRegisterPage}
                  className="login-form-register-button"
                >
                  注册
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-submit-button"
                >
                  登录
                </Button>
              </div>
            </Form>
          ) : (
            <Spin />
          )}
        </section>
      </LoginFormWrapper>
    </PageWrapper>
  );
};
export default LoginPage;
