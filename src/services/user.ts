
import services from "./index";

export function getUserInfo():Promise<any>{
    return new Promise<any>((resolve,reject) =>{
        setTimeout(() =>{
            resolve({
                "status": 200,
                "data": {
                    "userinfo": {
                        "id": "171",
                        "username": "ruanjiqian",
                        "real_name": "\u962e\u7ee7\u6f5c",
                        "department_id": "0",
                        "is_owner": "0",
                        "powers": null,
                        "action_web": "sys_set",
                        "allow_web": null
                    },
                },
                "msg":"success"
            })
        },2000);
    });
}


export function logOut():Promise<any>{
    return new Promise<any>((resolve,reject) =>{
        setTimeout(() =>{
            resolve({
                "status": 200,
                "data": {
                    "userinfo": {
                        "id": "171",
                        "username": "ruanjiqian",
                        "real_name": "\u962e\u7ee7\u6f5c",
                        "department_id": "0",
                        "is_owner": "0",
                        "powers": null,
                        "action_web": "sys_set",
                        "allow_web": null
                    },
                },
                "msg":"success"
            })
        },2000);
    });
}