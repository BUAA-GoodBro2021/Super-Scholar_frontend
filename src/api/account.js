import service from "../http/request";
const url = {
  login: "/user/login",
  register: "/user/register",
  findPassword: "/user/find_password",
  CAGetList: "/form/manager_check_claim",
  getSingleData: "/search/get_single_data_view",
  dealApply: "/form/manager_deal_claim",
  managerGetAllUser: "/form/manager_look_all_user",
  managerCheckUploadPdf: "/work/manager_check_upload_pdf",
  managerDealUploadPdf: "/work/manager_deal_upload_pdf",
  managerDeleteUserAuthor: "/form/manager_delete_user_author",
  findPassword:"/user/find_password",
  humanVerification: "/user/human_verify"
}
// 详细参考见：https://www.axios-http.cn/docs/req_config
export class Account {
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
  static async humanVerification(data) {
    return service(url.humanVerification, {
      method: "POST",
      data,
    });
  }
}
