<template>
    <div class="article_and_data_main_wrap">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="发表文献" name="documents" class="tab-pane">
                <DocumentListVue :documentList="documentList" v-if="claimed == 1"/>
                <div class="empty" v-else>该用户尚未认证</div>
            </el-tab-pane>
            <el-tab-pane label="数据分析" name="dataAnalyse" class="tab-pane">
                <DataAnalyseVue :tabChange="tabChangeToData" v-if="claimed == 1"/>
                <div class="empty" v-else>该用户尚未认证</div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import DocumentListVue from './DocumentList.vue';
import DataAnalyseVue from './DataAnalyse.vue';
const activeName = ref('documents')
const tabChangeToData = ref(false)
const props = defineProps({
    documentList: Object,
    dataCountByYear: Object,
    authorNetWork: Object,
    claimed: Number
})

const getAccountType = function () {
//todo 获取id所对应的myAcountType与otherAccountType
}

const handleClick = (tab) => {
    if(tab.paneName == 'dataAnalyse') tabChangeToData.value = true
    else tabChangeToData.value = false
    // if(activeName.value == 'documents') tabChangeToData.value++
}

</script>
<style scoped>
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

:deep(.demo-tabs .el-tabs__item) {
    font-size: 25px;
    font-weight: 800;
}

:deep(.demo-tabs .el-tabs__content){
    width: 100%;
    height: 100%;
}

:deep(.demo-tabs .el-tab-pane){
    height: 100%;
    width: 100%;
}

.empty{
    margin-top: 10px;
    color: grey;
    font-size: 25px;
    font-weight: 600;
}
</style>