import React from "react";
import img_404 from "../assets/images/404/404.png";
import img_404_cloud from "../assets/images/404/404_cloud.png";
import "../styles/404.less";
class Error404 extends React.Component{

    render(){
        let message = "";
        return (
            <div >
                <div className="wscn-http404">
                    <div className="pic-404">
                        <img className="pic-404__parent" src={img_404} alt="404"/>
                        <img className="pic-404__child left-404" src={img_404_cloud} alt="404"/>
                        <img className="pic-404__child mid-404" src={img_404_cloud} alt="404"/>
                        <img className="pic-404__child right-404" src={img_404_cloud} alt="404"/>
                    </div>
                    <div className="bullshit">
                        <div className="bullshit__oops">404</div>
                        <div className="bullshit__headline">{ message }</div>
                        <div className="bullshit__info">请检查您输入的网址是否正确，请点击以下按钮返回主页或者发送错误报告</div>
                        <a href="/" className="bullshit__return-home">返回首页</a>
                    </div>
                </div>
            </div>
        )
    }
}


export default Error404