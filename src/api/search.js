import service from "../http/request";
const url = {
    single: "/search/get_single_data_view",
    getSearchDataList: "/search/get_list_of_data_view",
    getGroupDataList: "/search/get_groups_of_data_view",
    getAssociateContent: "/search/associate_content_view",
    postSearchHistory: "/history/update_history",
    getDataView:"/search/get_index_data_view",
    getNumView: "search/get_open_alex_data_num_view",
    getRecommendedView: "search/get_recommended_data_view",
    getAdvanceSearch: "/search/advanced_search_view",
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
    // 获取首页全部内容
    static async getDataView(data) {
      return service(url.getDataView, {
        method: "POST",
        data,
      })
    }
    // 获取首页论文数值
    static async getNumView(data) {
      return service(url.getNumView, {
        method: "POST",
        data,
      })
    }
    // 获取首页推荐论文
    static async getRecommendedView(data) {
      return service(url.getRecommendedView, {
        method: "POST",
        data,
      })
    }
    // 高级检索
    static async getAdvanceSearchDataList(data) {
      return service(url.getAdvanceSearch, {
        method: "POST",
        data,
      })
    }
}