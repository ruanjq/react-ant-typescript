import React, { Component } from "react";
import { 
    BrowserRouter as Router, 
    Route, Switch,Redirect
} from "react-router-dom";
import {Provider} from "react-redux";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Auth from "./components/Auth"
import routers from "./routes/index";
import store from "./redux/store";
import "./styles/app";


interface IConfigProvider{
    locale:any;
}

const yourConfig:IConfigProvider = {
    "locale":{zhCN},
}

class App extends Component  {


    render() {
        // 参考 https://ant.design/components/config-provider-cn/ 配置
        console.log("routersroutersrouters",routers);
        return (
            // 通过provide把redux和react连接, store 传递到react 项目中
            <Provider store={store}>
                <ConfigProvider {...yourConfig}>
                    <Router> 
                        <Switch>
                            {/* 导入相关路由配置 */}
                            <Route exact path="/" render={() => <Redirect to="/app/index"/>} />
                            {routers.map((r, key) => 
                            <Route 
                                name={r.name} 
                                breadcrumbName={r.breadcrumbName} 
                                component={r.auth ? Auth(r.component) : r.component} 
                                key={key} 
                                path={r.path} 
                            />)}
                            <Redirect from='*' to='/404' />
                        </Switch>
                    </Router>
                </ConfigProvider>
            </Provider>
        );
    }
}

export default App