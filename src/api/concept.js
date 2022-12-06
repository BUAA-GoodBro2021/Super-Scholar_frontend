import service from "../http/request";
const url = {
  getConceptDetail: "/search/get_single_data_view",
  getConceptPaperList: "/search/get_list_of_data_view",
};

export class Concept {
  static async GetConceptDetail(data) {
    return service(url.getConceptDetail, {
      method: "post",
      data,
    });
  }

  static async GetConceptPaperList(data) {
    return service(url.getConceptPaperList, {
      method: "post",
      data,
    });
  }
}
