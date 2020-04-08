import axios from 'axios';
import qs from 'qs';
// import store from "../redux/store";
// create an axios instance
const service = axios.create({
    baseURL: "", // api的base_url
    timeout: 60000, // request timeout
    // headers: {
    //     'X-Requested-With': 'XMLHttpRequest'
    // },
    cancelToken: null // 取消请求
});

// setInterval(() =>{
    // console.log("axios",store.getState());
// },1000);

// request interceptor
service.interceptors.request.use(config => {
    // Do something before request is sent
  
    if (config.method === 'post') {
        let data = qs.parse(config.data, {
            parameterLimit: Infinity
        })

        config.data = qs.stringify({
            ...data
        })
    } else if (config.method === 'get') {
        config.params = {
            ...config.params
        }
    }
    // config.cancelToken = clearRequest0.source.token; // 取消请求
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
    response => {
        const res = response.data
        switch (res.status) {
            case 200:
                return res
            case 403:
                // logout()
                break
            default:

                return res
        }
    },
    error => { // 失败弹窗，取消不弹窗
        if (axios.isCancel(error)) {
            console.log('Request canceled', error.message);
            return Promise.reject(error)
        } else {
            console.log('err' + error) // for debug

            return Promise.reject(error)
        }
    }
);


export default service;