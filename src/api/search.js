import service from "../http/request";
const url = {
    single: "/search/get_single_data_view",
    list: "/search/get_list_of_data_view"
}
// 详细参考见：https://www.axios-http.cn/docs/req_config
export class Search{
    // 本次的body默认使用JSON而不是FormData
    static async single(data) {
        return service(url.single, {
          // 方法，默认为 get
          method: "post",
          // 返回值类型，默认为json
          responseType: "json",
          // 这里是 data: data的简写
          data,
        });
    }
    static async list(data) {
        return service(url.list, {
          method: "post",
          data,
        });
    }
}