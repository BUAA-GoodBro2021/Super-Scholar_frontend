<template>
    <div class="document-list-wrap">
        <div class="table-wrap">
            <el-table :data="documentList" style="width: 100%; height: 100%;">
                <el-table-column prop="display_name" label="文献" min-width="60%">
                    <template #default="scope">
                        <span class="document_title">{{ scope.row.display_name }}</span>
                        <div class="authors_wrap">
                            <span class="document_authors" v-for="(item, index) in scope.row.authorships"
                                :key="index">{{
                                        item.author.display_name
                                }}
                                <span v-if="index != scope.row.authorships.length - 1">/&nbsp;</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="publication_date" label="日期" min-width="17%" align="center" />
                <el-table-column prop="cited_by_count" label="引用" min-width="13%" align="center" />
                <el-table-column prop="pdf" label="状态" min-width="16%">
                    <template #default="scope">
                        <el-tag style="font-size: 10px;" v-if="scope.row.open_access.is_oa == -1" type="danger">暂无pdf
                        </el-tag>
                        <el-tag style="font-size: 10px;" v-if="scope.row.open_access.is_oa == 0" type="warning">审核中
                        </el-tag>
                        <el-tag style="font-size: 10px; cursor: pointer;" v-if="scope.row.open_access.is_oa == 1"
                            type="success" @click="ToPdf(scope.row.open_access)">已有pdf</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="pdf" label="操作" min-width="16%">
                    <template #default="scope">
                        <el-upload ref="upload" class="upload-demo" 
                            v-if="scope.row.open_access.is_oa == -1"
                            :limit="1"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-exceed="handleExceed">
                            <template #trigger>
                                <el-tag style="cursor: pointer;" type="success">上传pdf
                                </el-tag>
                            </template>
                        </el-upload>
                        <el-tag v-if="scope.row.open_access.is_oa == 0" style="cursor: pointer;" @click="CancelPdf()"
                            type="warning">取消上传</el-tag>
                        <el-tag v-if="scope.row.open_access.is_oa == 1" style="cursor: pointer;"
                            @click="CancelPdfConfirm(scope.row)" type="danger">删除pdf</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-wrap">
            <el-pagination layout="prev, pager, next" :total="pageTotalSize" @current-change="PageChange()"
                v-model:current-page="pageCurrent" hide-on-single-page :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" />
        </div>
        <el-dialog v-model="cancelPdfDialog">
            <template #title>
                <span class="dialog-title">确定删除该文章的PDF吗？</span>
            </template>
            <div style="display: flex; justify-content: center; ">
                <el-button @click="CancelPdf()" type="danger">确定</el-button>
                <el-button @click="cancelPdfDialog = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { defineEmits } from 'vue';
import { User } from "../../api/userDetail"
const emit = defineEmits(["pageChange"])
const props = defineProps({
    documentList: Object,
    pageTotalSize: Number,
    author_id: String
})
const pageCurrent = ref(1)
const document = ref()
const cancelPdfDialog = ref(false)
const CancelPdfConfirm = (data) => {
    cancelPdfDialog.value = true
    document.value = data
}
const CancelPdf = () => {
    User.CancelPdf({
        work_id: document.id.substring(21),
        author_id: author_id
    }).then((res) => {
        if (res.data.result == 1) {
            emit("DocumentChange")
        } else {
            ElNotification({
                title: "很遗憾",
                message: res.message,
                type: "error",
                duration: 3000
            })
        }
    }).catch((err) => {
        ElNotification({
            title: "很遗憾",
            message: err.message,
            type: "error",
            duration: 3000
        })
    })
}

const beforePdfUpload = (data) => {
    console.log('beforeUpload: ' + data)
}

const handleExceed = (data) => {
    console.log('handleExceed : ' + data)
}

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
        ],
        pdf: 0,
    },
    {
        display_name: '你是我的，我是你的谁',
        publication_date: '2022-4-31',
        cited_by_count: '11',
        pdf: -1,
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
        pdf: 1,
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

const PageChange = () => {
    emit("pageChange", pageCurrent.value)
}

const ToPdf = (data) => {
    console.log(data)
}

</script>
<style scoped>
.document-list-wrap {
    width: 100%;
    height: 100%;
}

.table-wrap {
    height: 90%;
}

.pagination-wrap {
    height: 10%;
    display: flex;
    justify-content: center;
}

.article_and_data_main_wrap {
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
    font-size: 15px;
    line-height: 30px;
    text-align: left;
    height: auto;
    display: block;
    word-break: break-all;
    word-wrap: break-word;
    color: #409eff;
    cursor: pointer;
}

.authors_wrap {
    word-break: break-all;
    word-wrap: break-word;
    line-height: 30px;
}

.document_authors {
    font-size: 10px;
    color: grey;
    cursor: pointer;
}

.document_authors:hover {
    color: #409eff;
}

::v-deep .el-table .cell {
    font-size: 15px;
}
</style>