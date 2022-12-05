import service from "../http/request";
const urlList = {
    lookMsgList:"/message/look_message_list",
    delMsg:"/message/delete_message",
    lookUnreadMsgCount:"/message/look_unread_message_count"
}
export class Message{
    static async lookMsgList(data){
        return service(urlList.lookMsgList,{
            method:"post",
            data
        })
    }
    static async delMsg(data){
        return service(urlList.delMsg,{
            method:"post",
            data
        });
    }
    static async lookUnreadMsgCount(data){
        return service(urlList.lookUnreadMsgCount,{
            method:"post",
            data
        });
    }
}