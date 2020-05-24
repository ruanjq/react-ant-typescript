


import React,{Component} from "react";


import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Panel from "./Panel";


interface IProps{
    [index: string]: any;
}

interface IState{

}

class Main extends Component<IProps,IState>{

    constructor(props:any){
        super(props);
    }

  
    render(){
        
        return (
            <div className="main-content">
                <div className="left">
                    <SideBar></SideBar>
                </div>
                <div className="right">
                    <NavBar></NavBar>
                    <Panel></Panel>
                </div>
            </div>
        )
    }
}

export default Main;