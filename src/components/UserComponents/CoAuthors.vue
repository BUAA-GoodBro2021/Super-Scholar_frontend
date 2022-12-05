<template>
    <div class="coauthors-wrap">
        <div class="coauthors-title">合著作者</div>
        <div class="author-list" v-if="claimed == 1">
            <div class="author-card" v-for="(item, index) in authorList" :key="index">
                <ul class="list-item">
                    <li>
                        <el-avatar :size="70"
                            :src="item.avatar_url ? avatar_url : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                            style="cursor: pointer;" @click="toAuthor(item)"></el-avatar>
                    </li>
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
                <el-divider v-if="index != authorList.length - 1"></el-divider>
            </div>
        </div>
        <div class="co-author-pagination" v-if="claimed == 1">
            <el-pagination layout="prev, pager, next" :total="authorTotalSize" @current-change="PageChange()"
                v-model:current-page="pageCurrent" hide-on-single-page :page-sizes="[1, 2, 3, 4, 5]" :pager-count="4"/>
        </div>
        <div class="empty" v-if="claimed == 0">
            该用户尚未认证
        </div>
    </div>
</template>
<script setup>
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
<style>
/* 整体的height和width由外层调整 */
.coauthors-wrap {
    width: 100%;
    background-color: white;
    border-radius: 20px;
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
    width: 0 !important;
}

::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
}


.author-card {
    width: 100%;
    height: 100px;
    margin-top: 5px;

}


.author-card ul {
    margin: 0;
    height: 90%;
    width: 100%;
}

.author-card ul:hover {
    background-color: #f1f5fa;
    border-radius: 10px;
}

.el-divider--horizontal {
    margin-top: 0;
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
    color: #409eff;
    /* height: 20%;
    margin-top: 5; */
    /* display: block; */
}

.right-arrow-li {
    line-height: 100%;
    float: right;
    margin-right: 10px;
    font-size: 30px;
    font-weight: 800;
}

.right-arrow-wrap {
    height: 80%;
    line-height: 100%;
    display: flex;
    align-items: center;
}

.right-arrow-wrap:hover{
    color: #409eff;
}

.empty {
    color: grey;
    font-size: 18px;
    font-weight: 600;
}
</style>