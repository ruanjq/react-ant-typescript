import React,{useState,ReactElement} from "react";
import {connect} from "react-redux";
import { Select,Menu,Dropdown } from 'antd';
import {withRouter} from "react-router-dom";
import {
    HomeOutlined,
    PoweroffOutlined,
    DownOutlined
} from "@ant-design/icons";

import {logOut} from "../services/user";



const menuOnClick = ({ key }) =>{
    switch(key){
        case "logout":
            logOut().then(res =>{
                window.location.href = "/login";
            })
            break;
        default:
            break;
    }
}


const OverlayMenu = (
    <Menu onClick={menuOnClick}>
        <Menu.Item key="home">
            <a rel="noopener noreferrer" href="/"><HomeOutlined />&nbsp;&nbsp;首 页
            </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item  key="logout">
            <span  onClick={e => e.preventDefault()}><PoweroffOutlined />退出登录</span>
        </Menu.Item>
    </Menu>
);

interface IProps{
    dispatch:any,
    userInfo:{
        account:string;
    }
}

interface IState{
    collapsed:boolean;

}

class NavBar extends React.Component<IProps,IState>{

    constructor(props:any){
        super(props);
    }
    
   
    render() {
        return (
            <div className="nav-bar-wrapper clearfix">
                <div className="site-menu">
                    
                </div>
                <div className="fr cursor-pointer">
                    <Dropdown overlay={OverlayMenu} placement="bottomRight">
                        <span className="ant-dropdown-link" onClick={e => e.preventDefault()}>
        欢迎:【{this.props.userInfo.account}】&nbsp; <DownOutlined />
                        </span>
                    </Dropdown>
                </div>
            </div>
        )
    }
}


// 通过connect连接组件和redux数据和dispatch方法
const mapStateToProps = (state,ownProps) => {
    return {
        userInfo:state.app.userInfo
    }
}


// 通过connect连接组件和redux数据和dispatch方法
export default withRouter(connect(mapStateToProps)(NavBar));