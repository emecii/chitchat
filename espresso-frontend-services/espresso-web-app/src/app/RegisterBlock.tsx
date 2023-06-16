import React, { useState, useEffect } from "react";
import {
  Modal,
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
  DatePicker,
  Select,
} from "antd";
import { useDispatch } from "react-redux";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import styled from "styled-components";
import axios from "axios";
import { HttpStatus } from "../types/HttpStatus";
import { usePkSystemHook } from "../state/pk-system-hook";
import { ENDPOINT } from "../types/Env";
import { useAuth } from "./AuthContext";

var console = require("console-browserify");

const items: MenuProps["items"] = [
  {
    label: "中国 +86",
    key: "1",
    icon: <UserOutlined />,
  },
];

// Form validation rules
const rules = {
  userName: [{ required: true, message: "请输入昵称" }],
  dob: [{ required: true, message: "请输入生日" }],
  gender: [{ required: true, message: "请输入性别" }],
  city: [{ required: true, message: "请输入城市" }],
  phoneNumber: [{ required: true, message: "请输入电话号码" }],
};

const RegisterBlock = () => {
  const [state, action] = usePkSystemHook();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  // State for the register modal
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

  // Open the register modal
  const showRegisterModal = () => {
    setIsRegisterModalVisible(true);
  };

  // Close the register modal
  const handleCancel = () => {
    setIsRegisterModalVisible(false);
  };

  // Handle register form submission
  const handleRegisterSubmit = async (values: any) => {
    const { userName, dob, gender, city, phoneNumber } = values;
    // create a random user_id
    var randomId = Math.random().toString(36).substring(7);

    await axios
      .post(`${ENDPOINT}/api/user-profile`, {
        user_id: randomId,
        user_name: userName,
        gender: gender,
        birthday: dob,
        city: city,
        phone: phoneNumber,
      })
      .then((response) => {
        if (response.status === HttpStatus.OK) {
          console.log("fetchModelProfile message", response.data.message);
          message.info("注册成功!");
          // Close the modal
          setIsRegisterModalVisible(false);
        } else {
          message.error("页面错误，请稍后重试。");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          // handle conflict error here
          console.log("User profile already exists for this user_id");
          message.error("用户已存在。");
        } else {
          console.error(err);
        }
        setIsRegisterModalVisible(true);
      });
  };

  const [form] = Form.useForm();
  // const dispatch = useDispatch()
  //const history = useHistory();
  const [loading, setLoading] = useState(false);

  let time = 60,
    timer: any;
  const [codetext, setCodeText] = useState<any>("获取验证码");

  const [country, setCountry] = useState<string>("+86");

  const goToRegister = async (phone: string, code: string) => {
    console.log("go to register");
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
          action.setUserToken(userToken);
          localStorage.setItem("userToken", userToken);
          const uID = response.data.data.userId;
          action.setUserId(uID);
          setLoading(false);
          // Set the isLoggedIn state to true
          setIsLoggedIn(true);
          // Close the modal
          action.setModelOpen(false);
        } else {
          setLoading(false);
          message.error("手机号或验证码有误，请重试");
        }
      })
      .catch((err) => {
        setLoading(false);
        message.error("手机号或验证码有误，请重试");
        console.log(err);
      });
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    var console = require("console-browserify");
    if (e.key == "2") {
      setCountry("+1");
      console.log("美国号码");
    } else {
      setCountry("+86");
      console.log("中国号码");
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const onFinish = (values: any) => {
    console.log("onFinish values:", values);
    const data = {
      phoneNumber: values.phone,
      verifyCode: values.verifyCode,
    };
    setLoading(true);
    goToRegister(data.phoneNumber, data.verifyCode);
  };

  const getCapcha = async () => {
    await form.validateFields(["phone"]);
    const data = {
      operationType: "login",
      phoneNumber: form.getFieldsValue().phone,
    };
    console.log("data.phoneNumber", data.phoneNumber);
    const res = await axios
      .post(`${ENDPOINT}/api/auth/login_or_register`, {
        phone: data.phoneNumber,
      })
      .then((response) => {
        console.log("regiester response ", response, "status", response.status);
        if (
          response.status === HttpStatus.OK ||
          response.status === HttpStatus.CREATED
        ) {
          message.success("验证码发送成功，请注意查收");
        } else if (response.status === HttpStatus.FORBIDDEN) {
          message.error("验证码发送过于频繁，请稍后再试");
        } else {
          message.error("验证码发送失败，请重试");
        }
      })
      .catch((err) => {
        if (err.response.status === HttpStatus.FORBIDDEN) {
          message.error("验证码发送过于频繁，请稍后再试");
        } else {
          message.error("验证码发送失败，请重试");
        }
      });
    timer = setInterval(() => {
      time--;
      setCodeText(time);
      if (time === 0 && timer) {
        clearInterval(timer);
        setCodeText("获取验证码");
        timer = 60;
      }
    }, 1000);
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("请完成校验再登录");
  };

  useEffect(() => {
    return (): void => {
      clearInterval(timer);
    };
  }, [timer]);

  return (
    <Style>
      <p style={{ color: "grey" }}>
        登录账号以保存聊天记录并解锁更多功能。未注册请先注册哦~
      </p>
      <section className="login-section">
        {!loading ? (
          <Form
            name="basic"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item label="手机号">
              <Row gutter={8}>
                <Col xs={7} sm={5}>
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
                    rules={[{ required: true, message: "请输入电话号码" }]}
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
                    rules={[{ required: true, message: "请先获取验证码" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Button
                    className="code-text"
                    disabled={codetext !== "获取验证码"}
                    onClick={getCapcha}
                  >
                    {codetext}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
            <div className="footer-btn">
              <Button
                type="primary"
                onClick={showRegisterModal}
                style={{ marginRight: "10px" }}
              >
                注册
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </div>
            {/* Register modal */}
            <Modal
              title="注册"
              visible={isRegisterModalVisible}
              onCancel={handleCancel}
              footer={null}
            >
              <Form onFinish={handleRegisterSubmit}>
                <Form.Item name="userName" label="昵称" rules={rules.userName}>
                  <Input />
                </Form.Item>
                <Form.Item name="dob" label="生日" rules={rules.dob}>
                  <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item name="gender" label="性别" rules={rules.gender}>
                  <Select
                    options={[
                      { label: "男", value: "男" },
                      { label: "女", value: "女" },
                      { label: "其他", value: "其他" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="city" label="城市" rules={rules.city}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name="phoneNumber"
                  label="手机(用于接收验证码登录）"
                  rules={rules.phoneNumber}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </Form>
        ) : (
          <Spin />
        )}
      </section>
    </Style>
  );
};
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
`;
