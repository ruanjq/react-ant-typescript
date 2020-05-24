import React from "react";
import {Spin} from "antd";
import Loadable from "react-loadable";
import {routePrefix} from "../modules/config";


let Loading = () => <Spin/>

let routes = [
    {
        path:routePrefix,
        name:"app",
        breadcrumbName:"首页",
        auth:true,
        component:Loadable({
            loader:()=> import("../layouts/Main"),
            loading:Loading
        }),
        childRoutes:[
            {
                path:"/index",
                name:"index",
                breadcrumbName:"",
                component:Loadable({
                    loader:()=> import("../views/home/Home"),
                    loading:Loading
                })
            },
            {
                path:"/setting/blackList",
                name:"blackList",
                breadcrumbName:"黑名单",
                component:Loadable({
                    loader:()=> import("../views/setting/BlackList"),
                    loading:Loading
                })
            },
        ]
    },{
        path:"/404",
        name:"notFound",
        auth:false,
        breadcrumbName:"notFound",
        component:Loadable({
            loader:()=> import("../components/404"),
            loading:Loading
        })
    },{
        path:"/login",
        name:"login",
        auth:false,
        breadcrumbName:"login",
        component:Loadable({
            loader:()=> import("../views/login/Login"),
            loading:Loading
        })
    },{
      path:"/test",
      name:"test",
      auth:false,
      breadcrumbName:"test",
      component:Loadable({
          loader:()=> import("../views/Test"),
          loading:Loading
      })
  }
]

export default routes;