import service from "../http/request";
const url = {
  getOtherUserDetail: '/user/get_other_user',
  getUserDetail: '/user/get_user',
  changeUserInfo: '/user/edit_introduction',

  getOpenAlexAuthorById: '/search/get_single_data_view',
  getAuthorDocumentListById: '/search/get_list_of_data_view',
  getAuthorNetById: '/author/get_relate_net',

  getFollowList: '/follow/follow_list',
  cancelFollow: '/follow/unfollow_author?=',
  followAuthor: '/follow/follow_author',

  uploadPdf: '/work/user_upload_pdf',
  cancelPdf: '/work/user_give_up_upload_pdf'
}
// 详细参考见：https://www.axios-http.cn/docs/req_config
export class User {
  // 本次的body默认使用JSON而不是FormData
  static async GetOtherUserDetail(data) {
    return service(url.getOtherUserDetail, {
      // 方法，默认为 get
      method: "post",
      // 返回值类型，默认为json
      responseType: "json",
      // 这里是 data: data的简写
      data,
    });
  }
  static async GetUserDetail(data) {
    return service(url.getUserDetail, {
      method: "post",
      data,
    });
  }
  static async ChangeUserInfo(data) {
    return service(url.changeUserInfo, {
      method: "post",
      data,
    });
  }
  static async GetOpenAlexAuthorById(data) {
    return service(url.getOpenAlexAuthorById, {
      method: "post",
      data,
    });
  }
  static async GetAuthorDocumentListById(data) {
    return service(url.getAuthorDocumentListById, {
      method: "post",
      data,
    });
  }
  static async GetAuthorNetById(data) {
    return service(url.getAuthorNetById, {
      method: "post",
      data,
    });
  }
  static async GetFollowList() {
    return service(url.getFollowList, {
      method: "post",
    });
  }
  static async CancelFollow(data) {
    return service(url.cancelFollow, {
      method: "post",
      data
    });
  }
  static async FollowAuthor(data) {
    return service(url.followAuthor, {
      method: "post",
      data
    });
  }
  static async UpLoadPdf(data) {
    return service(url.uploadPdf, {
      method: "post",
      data
    });
  }
  static async CancelPdf(data) {
    return service(url.cancelPdf, {
      method: "post",
      data
    });
  }
}