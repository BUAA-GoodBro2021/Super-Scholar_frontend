<template>
    <div class="coauthors-wrap">
        <div class="coauthors-title">合著作者</div>
        <div class="author-list" v-if="claimed == 1">
            <div class="author-card" v-for="(item, index) in authorList" :key="index">
                <div class="author-card-left"></div>
                <ul class="list-item">
                    <!-- <li>
                        <el-avatar :size="35"
                            :src="item.avatar_url ? avatar_url : authorAvatarUrl"
                            style="cursor: pointer;" @click="toAuthor(item)"></el-avatar>
                    </li> -->
                    <li class="coauthor-name-li">
                        <span class="coauthor-name" @click="toAuthor(item)" :title="item.author_name">{{ item.author_name }}</span>
                    </li>
                    <li class="right-arrow-li">
                        <span class="right-arrow-wrap">
                            <el-icon style="cursor: pointer;" @click="toAuthor(item)">
                                <Right />
                            </el-icon>
                        </span>
                    </li>
                </ul>
                <!-- <el-divider v-if="index != authorList.length - 1"></el-divider> -->
            </div>
        </div>
        <div class="co-author-pagination" v-if="claimed == 1">
            <el-pagination layout="prev, pager, next" :pager-count="5" :total="authorTotalSize" @current-change="PageChange()"
                v-model:current-page="pageCurrent" hide-on-single-page :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8]"/>
        </div>
        <div class="empty" v-if="claimed == 0">
            该用户尚未认证
        </div>
    </div>
</template>
<script setup>

import authorAvatarUrl from '../../assets/images/avatar.png'
import {
    Right
} from '@element-plus/icons-vue'
import { defineEmits } from 'vue';
const emit = defineEmits(["coAuthorPageChange"])
const router = useRouter();
const props = defineProps({
    authorList: Array,
    claimed: Number,
    authorTotalSize: Number,
})

const pageCurrent = ref(1)

const toAuthor = (item) => {
    let {href} = router.resolve({
        name: 'OpenAlexAuthorDetail',
        params: {tokenid: item.author_id}
    })
    window.open(href, "_blank")
}

const PageChange = () => {
    emit("coAuthorPageChange", pageCurrent.value)
}
</script>
<style scoped>
/* 整体的height和width由外层调整 */
.coauthors-wrap {
    width: 100%;
    /* background-color: white; */
    /* background: linear-gradient(70deg, #8f99af,rgb(218 204 135)); */
    /**配色 浅 */
    /* background: linear-gradient(70deg, #c4ccdc, rgb(218 204 135)); */
    border-radius: 2px;
    box-shadow: 3px 3px 3px 3px #dedede;
    height: 100%;
    padding-top: 10px;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.coauthors-title {
    font-size: 18px;
    font-weight: 800;
    text-align: left;
    width: 90%;
    height: 40px;
    line-height: 40px;
}

.author-list {
    width: 90%;
    height: calc(100% - 76px);
    overflow-y: auto;
}

.co-author-pagination {
    height: 10%;
    display: flex;
    justify-content: center;
}

::-webkit-scrollbar {
  width: 6px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: inherit;
  background-color: rgba(144, 147, 153, 0.3);
  -webkit-transition: 0.3s background-color;
  transition: 0.3s background-color;
}


.author-card {
    width: 100%;
    height: 70px;
    margin: 5px 0px 5px 0px;
    position: relative;
    padding: 17px 0 7px 20px;
    border-radius: 2px;
    /* background: linear-gradient(70deg, #445a7f,rgb(102 99 84)); */
    /**配色 深 */
    /* box-shadow: 3px 3px 0px 0px #726a6a; */
    /**配色 浅 */
    box-shadow: 3px 3px 0px 0px #cfcfcf;
}

.author-card:hover {
    background-color: #b7b7a8;
}

.author-card-left {
    position: absolute;
    width: 7px;
    height: 30px;
    left: 0;
    top: 20px;
    background-color: rgb(162, 143, 42);
}


.author-card ul {
    margin: 0;
    height: 90%;
    width: 100%;
}

/* .author-card ul:hover {
    background-color: #f1f5fa;
    border-radius: 10px;
} */

.el-divider--horizontal {
    margin-top: 5px;
    margin-bottom: 5px;
}

.author-card li {
    list-style: none;
    margin-right: 20px;
    display: inline-block;
    height: 100%;
    vertical-align: middle;
}

.author-card .coauthor-name-li {
    width: calc(100% - 160px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
}

.author-card .coauthor-name {
    font-size: 15px;
    font-weight: 800;
    text-align: left;
    display: flex;
    align-items: center;
    height: 80%;
    width: 100%;
    cursor: pointer;
    /* height: 20%;
    margin-top: 5; */
    /* display: block; */
}

.author-card .coauthor-name:hover {
    color: rgb(162, 143, 42);
    /* height: 20%;
    margin-top: 5; */
    /* display: block; */
}

.right-arrow-li {
    line-height: 100%;
    float: right;
    margin-right: 10px;
    font-size: 20px;
    font-weight: 800;
}

.right-arrow-wrap {
    height: 80%;
    line-height: 100%;
    display: flex;
    align-items: center;
}

.right-arrow-wrap:hover{
    color: rgb(162, 143, 42);
}

.empty {
    color: grey;
    font-size: 18px;
    font-weight: 600;
}


:deep(.co-author-pagination .is-active) {
    color: rgb(248 210 8) !important;
}

:deep(.co-author-pagination .el-pager li:hover) {
    color: rgb(248 210 8);
}

:deep(.co-author-pagination .el-pagination button) {
    background: none;
}

:deep(.co-author-pagination .el-pager li) {
    background: none;
}

:deep(.co-author-pagination .el-pagination button:hover) {
    color:rgb(248 210 8);
}
</style>