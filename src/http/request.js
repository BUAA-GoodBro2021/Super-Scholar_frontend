import axios from 'axios';
const service = axios.create({
    baseURL: "https://scholar.super2021.com/api",
    // 不进行超时中断
    timeout: 0,
})
// 请求拦截器
service.interceptors.request.use(
    (config)=>{
        const token = window.localStorage.getItem("token");
        if (token && token != "undefined") {
            // 问了下fgg,不需要Bearer
            config.headers.Authorization = token;
        }
        return config;
    },
    (error)=>{
        // 发生请求错误
        return Promise.reject(error);
    }
)
// 响应拦截器
service.interceptors.response.use(
    function(response){
        // 2xx 都会触发该函数
        // 如果不喜欢可以在开发过程中注释掉这行
        console.log("🚀response data🚀",response.data);
        return response;
    },
    function (error){
        // 发生响应错误
        return Promise.reject(error);
    }
)
export default service;