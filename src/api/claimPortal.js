import service from "../http/request";
const url = {
    searchAuthor: '/search/get_list_of_data_view',
    claimPortal: '/form/user_claim_author',
    abandonPortal: '/form/user_give_up_author'
}
// 详细参考见：https://www.axios-http.cn/docs/req_config
export class ClaimPortal{
    // 本次的body默认使用JSON而不是FormData
    static async SearchAuthor(data) {
        return service(url.searchAuthor, {
          // 方法，默认为 get
          method: "post",
          // 返回值类型，默认为json
          responseType: "json",
          // 这里是 data: data的简写
          data,
        });
    }

    static async ClaimPortal(data) {
        return service(url.claimPortal, {
          // 方法，默认为 get
          method: "post",
          // 返回值类型，默认为json
          responseType: "json",
          // 这里是 data: data的简写
          data,
        });
    }

    static async abandonPortal(data) {
        return service(url.abandonPortal, {
          // 方法，默认为 get
          method: "post",
          // 返回值类型，默认为json
          responseType: "json",
          // 这里是 data: data的简写
          data,
        });
    }
}