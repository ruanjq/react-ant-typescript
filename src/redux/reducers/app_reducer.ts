
import {APP_INFO} from "../actions/app_action";

const initialState = {
    appInfo:{},
    site: ''
};


export const appReducer = (state = initialState ,action:any) => {
    switch (action.type) {
        case APP_INFO:
            return {
                ...state,appInfo:action.payload
            }
        default:
            return state;
    }
}