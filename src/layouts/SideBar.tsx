import React from "react";
import { Menu, Button } from "antd";
import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
    ShopOutlined,
} from "@ant-design/icons";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import { throttle } from "../modules/tools";

import { appInfoAction } from "../redux/actions/app_action";

const { SubMenu } = Menu;

const MIN_BODY_WIDTH = 1200;

interface IProps{
    dispatch:any,
}

interface IState{
    collapsed:boolean;

}

class SiderBar extends React.Component<IProps, IState> {
    state = {
        collapsed: document.body.clientWidth <= MIN_BODY_WIDTH ? true : false,
    };

    constructor(props:any){
        super(props);
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    openCollapsed() {
        this.setState({
            collapsed: false,
        });
    }

    closeCollapsed = () => {
        this.setState({
            collapsed: true,
        });
    };

    UNSAFE_componentWillMount(){
        this.toggleEventListener();
        
    }

    componentDidMount() {
        this.props.dispatch(appInfoAction);
    }

    toggleEventListener() {
        let _self = this;
        window.addEventListener(
            "resize",
            throttle(function (e) {
                console.log(document.body.clientWidth);
                if (document.body.clientWidth <= MIN_BODY_WIDTH) {
                    _self.closeCollapsed();
                } else {
                    _self.openCollapsed();
                }
            }, 300)
        );
    }

    render() {
        return (
            <div
                className={`sider-bar-wrapper ${
                    !this.state.collapsed ? "sider-bar-open" : "sider-bar-close"
                    }`}
            >
                <Button
                    type="primary"
                    className="collapsed-sidebar"
                    onClick={this.toggleCollapsed}
                >
                    {this.state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
                <div className="logo">
                    <a href="/" className="app-name">
                        {/* <span className={this.state.collapsed ? "hidden" : ""}>ACTMS</span> */}
                        {this.state.collapsed ? <ShopOutlined /> : <img src={require("../assets/images/logo.png")} alt=""/>}
                    </a>
                </div>
                <div className="menu-box">
                    <Menu
                        defaultSelectedKeys={["1"]}
                        defaultOpenKeys={["sub1"]}
                        mode="inline"
                        theme="dark"
                        inlineCollapsed={this.state.collapsed}
                    >
                        <Menu.Item key="1">
                            <PieChartOutlined />
                            <span>Option 1</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <DesktopOutlined />
                            <span>Option 2</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <ContainerOutlined />
                            <span>Option 3</span>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                    <MailOutlined />
                                    <span>Navigation One</span>
                                </span>
                            }
                        >
                            <Menu.Item key="5">Option 5</Menu.Item>
                            <Menu.Item key="6">Option 6</Menu.Item>
                            <Menu.Item key="7">Option 7</Menu.Item>
                            <Menu.Item key="8">Option 8</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                                <span>
                                    <AppstoreOutlined />
                                    <span>Navigation Two</span>
                                </span>
                            }
                        >
                            <Menu.Item key="9">Option 9</Menu.Item>
                            <Menu.Item key="10">Option 10</Menu.Item>
                            <SubMenu key="sub3" title="Submenu">
                                <Menu.Item key="11">Option 11</Menu.Item>
                                <Menu.Item key="12">Option 12</Menu.Item>
                            </SubMenu>
                        </SubMenu>
                    </Menu>
                </div>
            </div>
        );
    }
}

// 通过connect连接组件和redux数据和dispatch方法
const mapStateToProps = (state,ownProps) => {
    return {
        app:state.app
    }
}


// 通过connect连接组件和redux数据和dispatch方法
export default withRouter(connect(mapStateToProps)(SiderBar));

