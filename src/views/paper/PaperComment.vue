<template>
    <el-space direction="vertical" :fill="true" :size="'small'" v-loading="loading">
        <el-input
                                v-model="commentContent"
                                placeholder="评论"
                                maxlength="440"
                                show-word-limit
                            >
            <template #append>
                <el-button :icon="Right" @click="addComment"/>
            </template>
        </el-input>
        <div style="width:100%" v-for="(item, index) in allComments" :key="index">
            <el-container>
                <el-aside width="auto" style="border-right:2px #efefef solid;padding:10px">
                    <img class="author-avatar" :src="item.user_information.avatar_url" />
                    <span>{{ item.user_information.username }}</span>
                </el-aside>
                <el-container>
                    <el-header style="height:auto;min-height: auto;">
                        <div class="reply_content">{{item.content}}</div>
                        <div class="reply_date">{{(new Date(item.created_time)).toLocaleString()}}</div>
                        <el-icon size="25px" @click="(selectedId == item.id)?(selectedId = -1):(selectedId = item.id);replyContent='';">
                            <ChatSquare v-if="(selectedId != item.id)"/>
                            <ChatDotSquare v-else/>
                        </el-icon>
                        <div v-if="(selectedId == item.id)">
                            <el-input
                                v-model="replyContent"
                                :placeholder="'回复 '+item.user_information.username"
                                maxlength="440"
                                show-word-limit
                            >
                                <template #append>
                                    <el-button :icon="Right" @click="replyComment"/>
                                </template>
                            </el-input>
                        </div>
                    </el-header>
                    <el-main v-if="(item.son_comments.length>0)">
                        <div v-for="(item, index) in item.son_comments" :key="index">
                            <el-divider content-position="left">
                                <img class="reply-author-avatar" :src="item.user_information.avatar_url" />
                                <span>{{ item.user_information.username }}</span>
                                <span  v-if="item.reply_user_information.username"> 回复 {{item.reply_user_information.username}}</span>
                            </el-divider>
                            <div class="reply_content">{{item.content}}</div>
                            <div class="reply_date">{{(new Date(item.created_time)).toLocaleString()}}</div>
                            <el-icon size="25px" @click="((selectedId == item.id)?(selectedId = -1):(selectedId = item.id));replyContent='';">
                                <ChatSquare v-if="(selectedId != item.id)"/>
                                <ChatDotSquare v-else/>
                            </el-icon>
                            <div v-if="(selectedId == item.id)">
                            
                            <el-input
                                v-model="replyContent"
                                :placeholder="'回复 '+item.user_information.username"
                                maxlength="440"
                                show-word-limit
                            >
                                <template #append>
                                    <el-button :icon="Right" @click="replyComment"/>
                                </template>
                            </el-input>
                        </div>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
            <el-divider v-if="(index != allComments.length - 1)"></el-divider>            
        </div>
    </el-space>
</template>
<script setup>
import {
    Right
} from '@element-plus/icons-vue'
import { Comment } from "../../api/comment";
const allComments = ref([])
const selectedId = ref(-1)
const replyContent = ref("")
const commentContent = ref("")
const loading = ref(true)
const props = defineProps({
    paperId: String,
    workName: String
})
function extractGrandChild(child){
    for(const gc of child.son_comments){
        extractGrandChild(gc)
        child.son_comments = child.son_comments.concat(gc.son_comments)
    }
}
function addComment(){
    Comment.add(props.paperId,props.workName,commentContent.value).then(
        (res)=>{
            selectedId.value = -1
            updateComment()
        }
    )
}
function replyComment(){
    Comment.reply(props.paperId,selectedId.value,replyContent.value).then(
        (res)=>{
            selectedId.value = -1
            updateComment()
        }
    )
}
function updateComment(){
    loading.value = true
    Comment.get(props.paperId).then(
        (res)=>{
            for(const childComment of res.data.all_comments){
                extractGrandChild(childComment)
                childComment.son_comments.sort(
                    (a,b)=>{
                        return ((new Date(a.created_time)) - (new Date(b.created_time)))
                    }
                )
            }
            allComments.value = res.data.all_comments
            loading.value = false
        }
    )
}
onMounted(() => {
    console.log("Comments of "+props.paperId)
    updateComment();
})
</script>
<style>
.author-avatar {
  width: 3rem;
  height: 3rem;
  margin-right: .3125rem;
  box-sizing: content-box;
  vertical-align: middle;
  padding-right: 0;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
}
.reply-author-avatar {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: .3125rem;
  box-sizing: content-box;
  vertical-align: middle;
  padding-right: 0;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
}
.reply_date{
    vertical-align:bottom;
    color: gray;
    float: right;
    margin-bottom: 10px;
}
.reply_content{
    margin-bottom: 10px;
}
</style>