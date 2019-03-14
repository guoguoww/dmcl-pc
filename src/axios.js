import axios from "axios";
import qs from 'qs';
import cookie from "./assets/js/cookie";
import router from "./router";
import { Toast } from "vant";

console.log(process.env)

let instance = axios.create({ //axios实例配置
    baseURL: process.env.VUE_APP_BASEURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

// http    拦截器
instance.interceptors.request.use(
    config => {
        if (config.method === 'post' && config.headers['Content-Type'] == 'application/x-www-form-urlencoded') { //post请求序列化
            config.data = qs.stringify(config.data);
        }
        let token = encodeURIComponent(cookie.get('_auth'));
        
        if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
          config.headers._auth = token;
          
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });
// http response 拦截器
instance.interceptors.response.use(
    response => {
        if (response.data.errorCode) {
            
            Toast(response.data.errorMsg)
        }
        if (response.data.errorCode == -2) {
            cookie.clear()
            router.push('/login')
            return
        }
        return response;
    },
    error => {
        console.log(error.response)
        if (error.response) {
            if (error.response.data.code){
                Toast(error.response.data.error)
            }
            if (error.response.data.errorCode) {
                Toast(error.response.data.errorMsg)
            }
            switch (error.response.status) {
                case 401:
                // 401 清除token信息并跳转到登录页面
                // cookie.clear()
                // router.push('login')
            }
            
        }
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        return Promise.reject(error.response.data) // 返回接口返回的错误信息
    });

export default instance