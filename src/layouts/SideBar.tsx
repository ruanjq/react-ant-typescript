import React from "react";
import { Menu, Button } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ShopOutlined,
    SettingOutlined
} from "@ant-design/icons";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import { throttle } from "../modules/tools";
import {routePrefix} from "../modules/config";
// import { appInfoAction } from "../redux/actions/app_action";

const MENU_DATA = require("../json/menu.json");

const { SubMenu } = Menu;

const MIN_BODY_WIDTH = 400;



interface IProps{
    dispatch:any;
    history:any;
    location:any
}

interface IState{
    collapsed:boolean;
    defaultOpenKeys:any
    defaultSelectedKeys:any;
    menuData:any[]
}

const MenuNode = (props) =>{
    let {list,defaultOpenKeys,defaultSelectedKeys,hanldClick,collapsed} = props ;
    if(list.length != 0){
        return (
            <Menu
                defaultOpenKeys={defaultOpenKeys}
                defaultSelectedKeys={defaultSelectedKeys} 
                onClick={hanldClick}  
                mode="inline" theme="dark" 
                inlineCollapsed={collapsed}>
                {list.map((pitem,pindex) => {
                    if(pitem.children && pitem.children.length){
                        return (
                            <SubMenu 
                                key={routePrefix + pitem.path}
                                title={<span><SettingOutlined/><span>{pitem.name}</span></span>}
                            >
                                {pitem.children.map((sub_item,sub_index) => {
                                    return (<Menu.Item key={routePrefix + "" + pitem.path +"" +sub_item.path}>{sub_item.name}</Menu.Item>)
                                })}
                            </SubMenu>
                        )
                    }else{
                        return (
                            <Menu.Item key={pitem.path}>
                                <SettingOutlined/>
                                <span>{pitem.name}</span>
                            </Menu.Item>
                        )
                    }
                })}
            </Menu>
        )
    } else {
        return null;
    }
}

class SiderBar extends React.Component<IProps, IState> {
    state = {
        collapsed: document.body.clientWidth <= MIN_BODY_WIDTH ? true : false,
        menuData:MENU_DATA.data.menus,
        defaultOpenKeys:[],
        defaultSelectedKeys: this.props.location.pathname
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
        this.setDefaultSelectedKeys();
    }

    setDefaultSelectedKeys(){
        let matchKey = this.state.defaultSelectedKeys.match(/^(\/.*)\//);
        console.log("matchKey",matchKey[1]);
        if(matchKey && matchKey[1]){
            this.setState({
                defaultOpenKeys:[matchKey[1]]
            })
        }
    }

    componentDidMount() {
        // this.props.dispatch(appInfoAction);
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

    autoOpenKey(menuData,currentUrl){
        console.log("menuData,currentUrl",menuData,currentUrl);
        let result = [];
        if(menuData instanceof Array){
            menuData.forEach((pitem,pindex) => {
                if(pitem.children && pitem.children.length){
                    pitem.children.forEach((sub_item,sub_index) => {
                        if(sub_item.path === currentUrl){
                            result =  ['' + pindex, pindex + '' + sub_index]
                        }
                    })
                } 
            })
        }
        return result;
    }

    linkTo = (item) =>{
        console.log("item",item);
        this.props.history.push(item.key);
    }

    render() {
        console.log(this.state.defaultSelectedKeys);
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
                    <MenuNode 
                        list={this.state.menuData} 
                        defaultOpenKeys={this.state.defaultOpenKeys} 
                        collapsed={this.state.collapsed}  
                        defaultSelectedKeys={this.state.defaultSelectedKeys} 
                        hanldClick={this.linkTo}
                    ></MenuNode>
                </div>
            </div>
        );
    }
}

// 通过connect连接组件和redux数据和dispatch方法
const mapStateToProps = (state,ownProps) => {
    return {
        userInfo:state.userInfo
    }
}


// 通过connect连接组件和redux数据和dispatch方法
export default withRouter(connect(mapStateToProps)(SiderBar));

