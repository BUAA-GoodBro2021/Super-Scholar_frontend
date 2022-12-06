import service from "../http/request";
const url = {
    single: "/search/get_single_data_view",
    getSearchDataList: "/search/get_list_of_data_view",
    getGroupDataList: "/search/get_groups_of_data_view",
    getAssociateContent: "/search/associate_content_view",
    postSearchHistory: "/history/update_history"
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
    // 获取搜索数据列表
    static async getSearchDataList(data) {
        return service(url.getSearchDataList, {
          method: "POST",
          data,
        });
    }
    // 获取分组后的搜索数据列表（用于在展开筛选单元时，获取筛选选项）
    static async getGroupDataList(data) {
      return service(url.getGroupDataList, {
        method: 'POST',
        data,
      })
    }
    // 搜索联想提示
    static async getAssociateContent(data) {
        return service(url.getAssociateContent, {
          method: "POST",
          data,
        });
    }
    // 更新历史记录
    static async postSearchHistory(data) {
        return service(url.postSearchHistory, {
          method: "POST",
          data,
        })
    }
}