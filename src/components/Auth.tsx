import React, { Component } from 'react'
import { connect } from 'react-redux'

interface IProps {
    [index: string]: any;
}

interface IState {

}

export default function(ComposedComponent){

    class Auth extends Component<IProps,IState>{
        componentWillMount() {
            console.log("componentWillMount",this.props.userInfo)
            if(!this.props.userInfo) {
                // this.props.history.push('/login');
            }
        };

        componentWillUpdate(nextProps) {
            console.log("componentWillUpdate",this.props.userInfo)
            if(!nextProps.userInfo) {
                // this.props.history.push('/login');
            }
        }

        render() {
            return <ComposedComponent {...this.props} />
        }
        
    }

    function mapStateToProps(state) {
        return { userInfo: state.app.userInfo };
    }

    return connect(mapStateToProps)(Auth);

}