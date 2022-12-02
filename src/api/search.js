import service from "../http/request";
const url = {
    single: "/search/get_single_data_view",
    list: "/search/get_list_of_data_view",
    getAssociateContent: "/search/associate_content_view",
}
// 详细参考见：https://www.axios-http.cn/docs/req_config
export class Search{
    // 本次的body默认使用JSON而不是FormData
    static async single(data) {
        return service(url.single, {
            method: "post",
            data,
          });
    }
    static async list(data) {
        return service(url.list, {
          method: "post",
          data,
        });
    }
    static async getAssociateContent(data) {
        return service(url.getAssociateContent, {
          method: "POST",
          data,
        });
    }
}