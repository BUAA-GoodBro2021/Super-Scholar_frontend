<template>
    <div class="article_and_data_main_wrap">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="发表文献" name="documents">
                <DocumentListVue :documentList="documentList" />
            </el-tab-pane>
            <el-tab-pane label="数据分析" name="dataAnalyse">

            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import DocumentListVue from './DocumentList.vue';
const activeName = ref('documents')
const props = defineProps({
    documentList: Object,
    dataCountByYear: Object,
    authorNetWork: Object,
})
const getAccountType = () => {
    //todo 获取id所对应的myAcountType与otherAccountType
}

const handleClick = () => {

}

</script>
<style>
.article_and_data_main_wrap{
    width: 100%;
    background-color: white;
    border-radius: 20px;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
}

.demo-tabs {
    width: 90%;
    height: 90%;
    margin-top: 30px;
    margin-bottom: 5%;
}

.el-tabs__item {
    font-size: 25px;
    font-weight: 800;
}

</style>