import service from "../http/request";
const url = {
  CAGetList: "/form/manager_check_claim",
  getSingleData: "/search/get_single_data_view",
  dealApply: "/form/manager_deal_claim",
  managerGetAllUser: "/form/manager_look_all_user",
  managerCheckUploadPdf: "/work/manager_check_upload_pdf",
  managerDealUploadPdf: "/work/manager_deal_upload_pdf",
  managerDeleteUserAuthor: "/form/manager_delete_user_author"
}
// 详细参考见：https://www.axios-http.cn/docs/req_config
export class Admin {
  // 本次的body默认使用JSON而不是FormData
  static async checkClaim(data) {
    return service(url.CAGetList, {
      method: "post",
      data,
    });
  }
  static async getSingleData(data) {
    return service(url.getSingleData, {
      method: "post",
      data,
    });
  }
  static async dealApply(data) {
    return service(url.dealApply, {
      method: "post",
      data,
    });
  }
  static async managerGetAllUser(data) {
    return service(url.managerGetAllUser, {
      method: "post",
      data,
    });
  }
  static async managerCheckUploadPdf(data) {
    return service(url.managerCheckUploadPdf, {
      method: "post",
      data,
    });
  }
  static async managerDeleteUserAuthor(data) {
    return service(url.managerDeleteUserAuthor, {
      method: "post",
      data:JSON.stringify(data),
    });
  }
}
