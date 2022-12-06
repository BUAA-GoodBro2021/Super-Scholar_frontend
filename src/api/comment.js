import service from "../http/request";
const url = {
  getComment: "/comment/get_all_comments",
  addComment: "/comment/add_comment",
  replyComment: "/comment/reply_comment",
};

export class Comment {
  static async get(work_id) {
    return service(url.getComment, {
      method: "post",
      data:{
        work_id:work_id
      },
    });
  }
  static async add(work_id,work_name,content) {
    console.log(work_name)
    return service(url.addComment, {
      method: "post",
      data:{
        work_id,
        content,
        work_name
      },
    });
  }
  static async reply(work_id,comment_id,content) {
    return service(url.replyComment, {
      method: "post",
      data:{
        work_id,
        content,
        comment_id
      },
    });
  }
}
