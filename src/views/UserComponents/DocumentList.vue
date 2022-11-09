<template>
    <div class="document-list-wrap">
        <el-table :data="processedDocumentList" style="width: 100%">
            <el-table-column prop="display_name" label="文献" width="700">
                <template #default="scope">
                    <span class="document_title">{{ scope.row.display_name }}</span>
                    <div class="authors_wrap">
                        <span class="document_authors" v-for="(item, index) in scope.row.authorList" :key="index">{{item.display_name}}
                            <span v-if="index != scope.row.authorList.length - 1">/&nbsp;</span>
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="publication_date" label="日期" width="180" sortable align="center" />
            <el-table-column prop="cited_by_count" label="引用数量" sortable  align="center"/>
        </el-table>
    </div>
</template>
<script setup>
const props = defineProps({
    documentList: Object,
})

const processedDocumentList = ref([
    {
        display_name: '鸡你太美鸡你太美迎面的你走来逐渐让我蠢蠢欲动，这种感觉从未有过cause I get a crash on you',
        publication_date: '2022-2-11',
        cited_by_count: '11',
        authorList: [
            {
                display_name: "harbour",
                id: '',
            },
            {
                display_name: "harbour",
                id: '',
            },
            {
                display_name: "harbour",
                id: '',
            },
        ]
    },
    {
        display_name: '你是我的，我是你的谁',
        publication_date: '2022-4-31',
        cited_by_count: '11',
        authorList: [
            {
                display_name: "harbour",
                id: '',
            },
            {
                display_name: "harbour",
                id: '',
            },
            {
                display_name: "harbour",
                id: '',
            },
        ]
    },
    {
        display_name: '再多一眼，看一眼就会爆炸，在近一点靠近点快被融化',
        publication_date: '2022-4-31',
        cited_by_count: '10',
        authorList: [
            {
                display_name: "harbour",
                id: '',
            },
            {
                display_name: "harbour",
                id: '',
            },
            {
                display_name: "harbour",
                id: '',
            },
        ]
    },]
)

onMounted(() => {
    //处理documentList 将publication_year与publication_date连接起来
})

</script>
<style>
.article_and_data_main_wrap{
    width: 100%;
    background-color: white;
    border-radius: 20px;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.document_title {
    margin-top: 5px;
    font-size: 20px;
    line-height: 30px;
    text-align: left;
    height: auto;
    display: block;
    word-break: break-all;
    word-wrap: break-word;
    color: #409eff;
    cursor: pointer;
}

.authors_wrap{
    word-break: break-all;
    word-wrap: break-word;
    line-height: 30px;
}

.document_authors{
    font-size: 17px;
    color: grey;
    cursor: pointer;
}

.document_authors:hover{
    color: #409eff;
}

.el-table .cell{
    font-size: 22px;
}
</style>