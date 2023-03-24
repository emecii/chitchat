import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Spin, Row, Col, Dropdown, MenuProps, Space } from 'antd';
import { useDispatch } from 'react-redux'
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';
import { HttpStatus } from '../types/HttpStatus';
import { usePkSystemHook } from '../state/pk-system-hook';
var console = require("console-browserify")

// interface Func {
//   (value: string): void
// }
// interface Props {
//   goToRegister: Func
// }
const items: MenuProps['items'] = [
  {
    label: '中国 +86',
    key: '1',
    icon: <UserOutlined />,
  },
  {
    label: '美国 +1',
    key: '2',
    icon: <UserOutlined />,
  }
];



const RegisterBlock = () => {
  const [state, action] = usePkSystemHook();
  const [form] = Form.useForm();
  // const dispatch = useDispatch()
  //const history = useHistory();
  const [loading, setLoading] = useState(false)

  let time = 60, timer: any
  const [codetext, setCodeText] = useState<any>('获取验证码')

  const [country, setCountry] = useState<string>('中国 +86')

  const goToRegister = async (phone: string, code: string) => {
    console.log("go to register")
    const res = await axios
      .post(`https://chitchat-ai-backend:3000/api/auth/verify`,
        {
          "otp": code,
          "phone": phone
        })
      .then((response) => {
        if(response.status === HttpStatus.OK || response.status === HttpStatus.CREATED) {
          const userToken = response.data.data.token;
          action.setUserToken(userToken);
          const uID = response.data.data.userId;
          action.setUserId(uID);
          setLoading(false)
        }
        else {
          setLoading(false)
          message.error("手机号或验证码有误，请重试")
        }
      })
      .catch((err) => {
        setLoading(false)
        message.error("手机号或验证码有误，请重试")
        console.log(err)
      });
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    var console = require("console-browserify")
    if (e.key == "2") {
      setCountry("美国 +1")
      console.log('美国号码');
    }
    else {
      setCountry("中国 +86")
      console.log('中国号码');
    }

  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const onFinish = (values: any) => {
    const data = {
      phoneNumber: values.phone,
      verifyCode: values.verifyCode
    }
    setLoading(true)
    goToRegister(data.phoneNumber, data.verifyCode)
    //setLoading(false)
    // openApi.loginInNoPwd(data).then((res) => {
    //   setLoading(false)
    //   if (res) {
    //     dispatch(loginIn(res, res.token))
    //     history.push('/')
    //   }
    // })
  };

  const getCapcha = async () => {
    await form.validateFields(['phone'])
    const data = {
      operationType: 'login',
      phoneNumber: form.getFieldsValue().phone
    }
    console.log("data.phoneNumber", data.phoneNumber)
    const res = await axios
      .post(`https://chitchat-ai-backend:3000/api/auth/login_or_register`,
        {
          "phone": data.phoneNumber
        })
      .then((response) => {
        console.log("regiester response ", response, "status", response.status)
        if (response.status === HttpStatus.OK || response.status === HttpStatus.CREATED) {
          message.success('验证码发送成功，请注意查收');
        }
        else {
          message.error('验证码发送失败，请重试')
        }
      })
      .catch((err) => {
        message.error('验证码发送失败，请重试')
      });
    // openApi.sendMessage(data).then((res) => {
    //   if (res) {
    //     message.success('验证码发送成功，请注意查收')
    //   }
    // })
    timer = setInterval(() => {
      time--;
      setCodeText(time);
      if (time === 0 && timer) {
        clearInterval(timer)
        setCodeText('获取验证码')
        timer = 60
      }
    }, 1000)
  }

  const onFinishFailed = (errorInfo: any) => {
    message.error('请完成校验再登录')
  };

  useEffect(() => {
    return (): void => {
      clearInterval(timer)
    }
  }, [timer])

  return (
    <Style>
      <p style={{ color: "grey" }} >登录账号以保存聊天记录并解锁更多功能</p>
      <section className='login-section'>
        {!loading ? (
          <Form
            name="basic"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="手机号"
            >
              <Row gutter={8}>
                <Col span={7}>
                  <Dropdown menu={menuProps}>
                    <Button>
                      <Space>
                        {country}
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                </Col>
                <Col span={17}>
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
            <Form.Item
              label="验证码"
            >
              <Row gutter={8}>
                <Col span={16}>
                  <Form.Item
                    name="verifyCode"
                    noStyle
                    rules={[{ required: true, message: '请先获取验证码' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Button className="code-text" disabled={codetext !== '获取验证码'} onClick={getCapcha}>{codetext}</Button>
                </Col>
              </Row>
            </Form.Item>
            <div className='footer-btn'>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </div>

          </Form>) : <Spin />}
      </section>
    </Style>)
}
export default React.memo(RegisterBlock);

const Style = styled.div`
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
  .code-text {
    min-width: 120px;
  }
  .login-section {
    margin-top: 2rem;
    margin-left: 0.7rem;
  }
  .login-form-button {
    background-color: black;
  }
`