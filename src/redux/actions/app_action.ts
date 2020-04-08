
import {getUserInfo} from "../../services/user";


export const APP_INFO = 'APP_INFO';


export const appInfoAction = async (dispatch:any) =>{
    const res = await getUserInfo();
    
    dispatch({
        type:APP_INFO,
        payload:res
    });
}


