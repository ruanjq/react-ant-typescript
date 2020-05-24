
import {login} from "../../services/user";


export const LOGIN = 'LOGIN';


export const loginAction = (param) => async (dispatch:any,getState:any) =>{
    const res = await login(param); 
    dispatch({
        type:LOGIN,
        payload:param
    });
}


