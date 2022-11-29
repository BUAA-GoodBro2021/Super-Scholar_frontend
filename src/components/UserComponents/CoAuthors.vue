<template>
    <div class="coauthors-wrap">
        <div class="coauthors-title">合著作者</div>
        <div class="author-list" v-if="claimed == 1">
            <div class="author-card" v-for="(item, index) in authorList" :key="index">
                <ul>
                    <li>
                        <el-avatar :size="70"
                            :src="item.avatar_url ? avatar_url : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                            style="cursor: pointer;"></el-avatar>
                    </li>
                    <li>
                        <span class="coauthor-name">{{ item.display_name }}</span>
                    </li>
                    <li class="right-arrow-li">
                        <span class="right-arrow-wrap">
                            <el-icon style="cursor: pointer;">
                                <Right />
                            </el-icon>
                        </span>
                    </li>
                </ul>
                <el-divider v-if="index != authorList.length - 1"></el-divider>
            </div>
        </div>
        <div class="empty" v-else>
            该用户尚未认证
        </div>
    </div>
</template>
<script setup>
import {
    Right
} from '@element-plus/icons-vue'
const props = defineProps({
    authorList: Object,
    claimed: Number,
})

const authorList = ref(
    [
        {
            display_name: '蔡徐坤',
            id: '',
            avatar_url: ''
        },
        {
            display_name: '全民制作人',
            id: '',
            avatar_url: ''
        },
        {
            display_name: '悠悠球琛总',
            id: '',
            avatar_url: ''
        },
    ]
)

</script>
<style>
/* 整体的height和width由外层调整 */
.coauthors-wrap {
    width: 100%;
    background-color: white;
    border-radius: 20px;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.coauthors-title {
    font-size: 18px;
    font-weight: 800;
    text-align: left;
    margin-top: 30px;
    margin-bottom: 30px;
    width: 90%;
}

.author-list {
    width: 90%;
    height: auto;
    overflow-y: auto;
}

.author-card {
    width: 100%;
    height: 100px;
    margin-top: 5px;
}


.author-card ul {
    margin: 0;
    height: 90%;
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

.author-card .coauthor-name {
    font-size: 15px;
    font-weight: 800;
    text-align: left;
    display: flex;
    align-items: center;
    height: 80%;
    cursor: pointer;
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

.right-arrow-wrap{
    height: 80%;
    line-height: 100%;
    display: flex;
    align-items: center;
}

.empty{
    color: grey;
    font-size: 25px;
    font-weight: 600;
}
</style>