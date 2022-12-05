import service from "../http/request";
const url = {
  getInstitutionDetail: "/search/get_single_data_view",
  getInstitutionPaperList: "/search/get_list_of_data_view",
};

export class Institution {
  static async GetInstitutionDetail(data) {
    return service(url.getInstitutionDetail, {
      method: "post",
      data,
    });
  }

  static async GetInstitutionPaperList(data) {
    return service(url.getInstitutionPaperList, {
      method: "post",
      data,
    });
  }
}
