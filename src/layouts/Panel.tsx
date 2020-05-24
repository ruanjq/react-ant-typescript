import React,{Component} from "react";
import {Route, Switch,Redirect,Link,withRouter,RouteComponentProps} from "react-router-dom";

import { Breadcrumb } from 'antd';
import routers from "../routes/index";

const RenderBreadcrumb = (props) =>{
    console.log(props);
    return (
        <Breadcrumb>
        {routers.map((r,key) => {
            if(r.path === props.matchPath && r.childRoutes){
                return (
                    <Breadcrumb.Item key={key}><Link to={r.path + "/index"}>{r.breadcrumbName}</Link></Breadcrumb.Item>
                    // <Breadcrumb.Item key={key}>{r.breadcrumbName}</Breadcrumb.Item>
                )
            } else if(r.path === props.matchPath){
                return (
                    <Breadcrumb.Item key={key}>{r.breadcrumbName}</Breadcrumb.Item>
                )
            }
        })}
        {routers.map((r,key) => {
            if(r.path === props.matchPath && r.childRoutes){
                return r.childRoutes.map((child_r,child_key) =>{
                    if(r.path + "" + child_r.path === props.pathName){
                        return <Breadcrumb.Item key={child_key}>{child_r.breadcrumbName}</Breadcrumb.Item>
                    }
                })
            }
        })}
        </Breadcrumb>
    )
}


interface IProps extends RouteComponentProps{
    [index: string]: any;
}

interface IState{

}
class Panel extends Component<IProps,IState>{

    constructor(props:any){
        super(props);
        
    }
    
    render(){
        
        let matchPath = this.props.match.path;
        let pathName = this.props.location.pathname;
        // console.log("matchPath",this.props)
        return (
            <div className="main-wrapper">
                <RenderBreadcrumb pathName={pathName} matchPath={matchPath} />
                <div className="main-body">
                    {routers.map((r, key) => {
                        if(r.path === matchPath && r.childRoutes){
                            return <div key={key}>
                                {r.childRoutes.map((child_r,child_key) =>{
                                    return <Route 
                                            name={r.name +""+child_r.name} 
                                            breadcrumbName={child_r.breadcrumbName} 
                                            component={child_r.component} 
                                            key={child_key} 
                                            path={matchPath + ""+child_r.path} />;
                                })}
                                {/* // 如果匹配不到默认重定向到index 这个路由 */}
                                {/* <Redirect from="*" to="/404"/> */}
                            </div>
                        } 
                    })}
                </div>
            </div>
        )
    }
}

export default withRouter(Panel);