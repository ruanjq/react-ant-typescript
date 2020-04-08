import React from "react";
import {Spin} from "antd";
import Loadable from "react-loadable";


let Loading = () => <Spin/>

let routes = [
    {
        path:"/app",
        name:"app",
        breadcrumbName:"",
        exact:false,
        component:Loadable({
            loader:()=> import("../layouts/Main"),
            loading:Loading
        }),
        childRoutes:[
            {
                path:"/index",
                name:"index",
                breadcrumbName:"",
                exact:true,
                component:Loadable({
                    loader:()=> import("../views/home/Home"),
                    loading:Loading
                })
            } 
        ]
    },{
        path:"/404",
        name:"notFound",
        exact:false,
        component:Loadable({
            loader:()=> import("../components/404"),
            loading:Loading
        })
    },{
        path:"/login",
        name:"login",
        exact:false,
        component:Loadable({
            loader:()=> import("../views/login/Login"),
            loading:Loading
        })
    }
]

export default routes;