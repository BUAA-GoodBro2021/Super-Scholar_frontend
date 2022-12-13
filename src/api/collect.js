import service from "../http/request";
const url = {
    addCollection: '/collection/add_collection_package',
    deleteCollection: '/collection/delete_collection_package',
    renameCollection: '/collection/change_package_name',
    cancelDocument: '/collection/cancel_work',
    addDocument:'/collection/collect_work',
    getCollection: '/collection/get_collection_package_list',
    getDocumentList: '/search/get_list_of_data_view',
    getCollectionListByPaper: '/collection/get_collection_package_by_id',
}
// 详细参考见：https://www.axios-http.cn/docs/req_config
export class Collection{
    // 本次的body默认使用JSON而不是FormData
    static async AddCollection(data) {
        return service(url.addCollection, {
          // 方法，默认为 get
          method: "post",
          // 返回值类型，默认为json
          responseType: "json",
          // 这里是 data: data的简写
          data,
        });
    }

    static async DeleteCollection(data) {
        return service(url.deleteCollection, {
          // 方法，默认为 get
          method: "post",
          // 返回值类型，默认为json
          responseType: "json",
          // 这里是 data: data的简写
          data,
        });
    }

    static async RenameCollection(data) {
        return service(url.renameCollection, {
          // 方法，默认为 get
          method: "post",
          // 返回值类型，默认为json
          responseType: "json",
          // 这里是 data: data的简写
          data,
        });
    }

    static async CancelDocument(data) {
        return service(url.cancelDocument, {
          // 方法，默认为 get
          method: "post",
          // 返回值类型，默认为json
          responseType: "json",
          // 这里是 data: data的简写
          data,
        });
    }

    static async AddDocument(data) {
      return service(url.addDocument, {
        // 方法，默认为 get
        method: "post",
        // 返回值类型，默认为json
        responseType: "json",
        // 这里是 data: data的简写
        data,
      });
  }

    static async GetCollection(data) {
        return service(url.getCollection, {
          // 方法，默认为 get
          method: "post",
          // 返回值类型，默认为json
          responseType: "json",
          // 这里是 data: data的简写
          data,
        });
    }

    static async GetDocumentList(data) {
      return service(url.getDocumentList, {
        // 方法，默认为 get
        method: "post",
        // 返回值类型，默认为json
        responseType: "json",
        // 这里是 data: data的简写
        data,
      });
  }
  static async GetCollectionListByPaper(data) {
    return service(url.getCollectionListByPaper, {
      // 方法，默认为 get
      method: "post",
      // 返回值类型，默认为json
      responseType: "json",
      // 这里是 data: data的简写
      data,
    });
}
}