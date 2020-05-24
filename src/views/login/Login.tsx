import React,{Component} from "react";
import {connect} from "react-redux";
import {withRouter,RouteComponentProps} from "react-router-dom";
import { Form, Input, Button, Checkbox,message  } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {login} from "../../services/user";
import {loginAction} from "../../redux/actions/app_action";

import "./login.less";


interface IProps extends RouteComponentProps{
    [index: string]: any;
}

interface IState{
    loading:boolean
}

class Login extends Component<IProps,IState>{

    state = {
        loading:false
    }
    constructor(props:any){
        super(props);
    }

    onFinish = async (values) =>{
        this.setState({
            loading:true
        })
        const key = "updatable";
        try {
            let data = await login({
                account:values.account,
                password:values.password
            });
            console.log(data);
            if(data.code === 0){
                this.props.dispatch(loginAction({
                    account:values.account,
                    password:values.password
                }))
                this.props.history.push("/app/index");
            } else{
                this.setState({
                    loading:false
                })
                message.error({ content: data.msg, key, duration: 4 });
            }
            
        } catch (error) {
            this.setState({
                loading:false
            })
            message.error({ content: error, key:'updatable', duration: 4 });
        }
    }

    render(){
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
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                        name="account"
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
                            <Button type="primary" loading={this.state.loading}  block htmlType="submit" className="login-form-button ant-btn-lg">
                                {this.state.loading ? "正在登录..." :"登 录"}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}

// 通过connect连接组件和redux数据和dispatch方法
const mapStateToProps = (state,ownProps) => {
    return {
        
    }
}
export default withRouter(connect(mapStateToProps)(Login));