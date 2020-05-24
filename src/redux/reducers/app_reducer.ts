
import {LOGIN} from "../actions/app_action";



const initialState = {
    userInfo:{
        account:"...",
        token:""
    }
};


export const appReducer = (state = initialState ,action:any) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,userInfo:action.payload
            }
        default:
            return state;
    }
}