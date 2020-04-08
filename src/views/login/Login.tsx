import React,{useState} from "react";
import {withRouter} from "react-router-dom";
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import "./login.less";




const Login = (props:any) => {

    const onFinish = () =>{
        props.history.push("/app/index");
    }

 
    return (
        <div className="antd-pro-layouts-user-layout-container">
            <div className="antd-pro-layouts-user-layout-header">
                <a href="/">
                    <img alt="logo" className="antd-pro-layouts-user-layout-logo" src={require("../../assets/images/logo")} />
                        <span className="antd-pro-layouts-user-layout-title">活动平台管理系统</span>
                </a>
            </div>
            <div className="antd-pro-pages-user-login-style-main">
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                    >
                    <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入登录密码' }]}
                    >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password" size="large" 
                        placeholder="Password"
                    />
                    </Form.Item>
                    <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>保存密码</Checkbox>
                    </Form.Item>

                
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" block htmlType="submit" className="login-form-button ant-btn-lg">
                            登 录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}


export default withRouter(Login);