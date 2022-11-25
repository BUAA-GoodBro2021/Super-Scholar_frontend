import service from "../http/request";
const url = {
    login: "/user/login",
    register:"/user/register",
    findPassword:"/user/find_password",
}
// 详细参考见：https://www.axios-http.cn/docs/req_config
export class Account{
    // 本次的body默认使用JSON而不是FormData
    static async login(data) {
        return service(url.login, {
          // 方法，默认为 get
          method: "post",
          // 返回值类型，默认为json
          responseType: "json",
          // 这里是 data: data的简写
          data,
        });
    }
    static async register(data) {
        return service(url.register, {
          method: "post",
          data,
        });
    }
    static async findPassword(data) {
        return service(url.findPassword, {
          method: "post",
          data,
        });
    }
}