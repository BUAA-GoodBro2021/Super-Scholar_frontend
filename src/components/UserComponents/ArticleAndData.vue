<template>
    <div class="article_and_data_main_wrap">
        <div class="left-bottom"></div>
        <div class="left-bottom"></div>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="发表文献" name="documents" class="tab-pane">
                <DocumentListVue :documentList="documentList" v-if="claimed == 1" :pageTotalSize="pageTotalSize"
                    @pageChange="pageChange" :author_id="author_id" :personalAccount="personalAccount"/>
                <div class="empty" v-else>该用户尚未认证</div>
            </el-tab-pane>
            <el-tab-pane label="数据分析" name="dataAnalyse" class="tab-pane">
                <DataAnalyseVue :tabChange="tabChangeToData" v-if="claimed == 1" :authorName="authorName" :dataCountByYear="dataCountByYear" :authorNetWork="authorNetWork"/>
                <div class="empty" v-else>该用户尚未认证</div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import DocumentListVue from './DocumentList.vue';
import DataAnalyseVue from './DataAnalyse.vue';
import { defineEmits } from 'vue';
const emit = defineEmits(["pageChange"])
const activeName = ref('documents')
const tabChangeToData = ref(false)
const props = defineProps({
    documentList: Object, //文献列表
    dataCountByYear: Object, //数据分析
    authorNetWork: Array,  // 数据分析
    claimed: Number, //是否认证
    pageTotalSize: Number, //文献总条数
    author_id: String, 
    authorName: String,
    personalAccount: Number, //是不是自己的账户
})

const getAccountType = function () {
    //todo 获取id所对应的myAcountType与otherAccountType
}

const handleClick = (tab) => {
    if (tab.paneName == 'dataAnalyse') tabChangeToData.value = true
    else tabChangeToData.value = false
    // if(activeName.value == 'documents') tabChangeToData.value++
}

const pageChange = (page) => {
    console.log('ArticleAndData.vue: ' + page)
    emit("pageChange", page)
}


</script>
<style scoped>
.article_and_data_main_wrap {
    width: 100%;
    /*深色 */
    /* background: linear-gradient(70deg, #8f99af,rgb(218 204 135)); */
    /*浅色 */
    /* background: linear-gradient(70deg, #ebedf1,rgb(220, 219, 213)); */
    /* background-color: white; */
    border-radius: 2px;
    box-shadow: 3px 3px 3px 3px #dedede;
    height: 100%;
    padding-top: 10px;

    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
}

.left-bottom {
    position: absolute;
    height: 80px;
    width: 80px;
    border: 10px solid transparent;

    /**深色 */
    border-left-color: #445a7f;
    border-bottom-color: #445a7f;

    /**浅色 */
    border-left-color: rgb(184 179 154);
    border-bottom-color: rgb(184 179 154);
    background-color: transparent;

    bottom: 0;
    left: 0;
}

.demo-tabs {
    width: 90%;
    /* 页码高度是36px */
    height: calc(100% - 36px);
    margin-bottom: 36px;
}

:deep(.demo-tabs .el-tabs__item) {
    font-size: 18px;
    font-weight: 800;
}

:deep(.demo-tabs .el-tabs__content) {
    width: 100%;
    height: 96%;
}

:deep(.demo-tabs .el-tab-pane) {
    height: 100%;
    width: 100%;
}

:deep(.demo-tabs .is-active) {
    color: rgb(162, 143, 42);
}

:deep(.demo-tabs  .el-tabs__active-bar) {
    background-color: rgb(162, 143, 42);
}

:deep(.demo-tabs .el-tabs__item:hover) {
    color: rgb(162, 143, 42);
}

:deep(.demo-tabs .el-tabs__header) {
    margin-bottom: 5px;
}

.empty {
    margin-top: 10px;
    color: grey;
    font-size: 18px;
    font-weight: 600;
}
</style>