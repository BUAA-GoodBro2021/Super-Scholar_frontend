<template>
    <div class="document-list-wrap">
        <div class="table-wrap">
            <el-table :data="documentList" style="width: 100%; height: 100%;">
                <el-table-column prop="display_name" label="文献" min-width="60%">
                    <template #default="scope">
                        <span class="document_title">{{ scope.row.display_name }}</span>
                        <!-- <div class="authors_wrap">
                            <span class="document_authors" v-for="(item, index) in scope.row.authorships"
                                :key="index">{{
                                        item.author.display_name
                                }}
                                <span v-if="index != scope.row.authorships.length - 1">/&nbsp;</span>
                            </span>
                        </div> -->
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
                <el-table-column prop="pdf" label="操作" min-width="16%" v-if="personalAccount == 1">
                    <template #default="scope">
                        <el-upload ref="uploadRef" class="upload-demo" v-if="scope.row.open_access.is_oa == -1" :limit="1"
                            :auto-upload="false" action="" :show-file-list="false" :on-change="(file, filelist) => changeFile(file, filelist, scope.row)" accept=".pdf">
                            <el-tag style="cursor: pointer;" v-if="!scope.row.uploading">上传pdf
                            </el-tag>
                            <span v-if="scope.row.uploading">
                                <el-icon class="is-loading" >
                                    <Loading />
                                </el-icon>
                             </span>
                        </el-upload>
                        <el-tag v-if="scope.row.open_access.is_oa == 0" style="cursor: pointer;" @click="CancelUploadingPdf(scope.row)">
                            取消上传</el-tag>
                        <el-tag v-if="scope.row.open_access.is_oa == 1" style="cursor: pointer;"
                            @click="CancelPdfConfirm(scope.row)">删除pdf</el-tag>
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
import {
    ArrowDown,
    ArrowUp,
    SuccessFilled,
    Loading
} from '@element-plus/icons-vue'
const emit = defineEmits(["pageChange"])
const uploadRef = ref(null)
const props = defineProps({
    documentList: Object,
    pageTotalSize: Number,
    author_id: String,
    personalAccount: Number
})
const pageCurrent = ref(1)
const document = ref(
    {
        id: '123'
    }
)
const cancelPdfDialog = ref(false)

const CancelUploadingPdf = (item) => {
    User.CancelPdf({
        work_id: item.id.substring(21),
        author_id: props.author_id
    }).then((res) => {
        if (res.data.result == 1) {
            emit("pageChange", pageCurrent.value)
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

const CancelPdfConfirm = (data) => {
    cancelPdfDialog.value = true
    document.value = data
}
const CancelPdf = () => {
    User.CancelPdf({
        work_id: document.value.id.substring(21),
        author_id: props.author_id
    }).then((res) => {
        if (res.data.result == 1) {
            emit("pageChange", pageCurrent.value)
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

const changeFile = async (file, filelist, item) => {
    let data = new FormData()
    data.append("work_id", item.id.substring(21))
    data.append("author_id", props.author_id)
    data.append("pdf", filelist[0].raw)
    item.uploading = true
    User.UpLoadPdf(data).then((res) => {
        if (res.data.result == 1) {
            emit("pageChange",  pageCurrent.value)
            ElNotification({
                title: "Success",
                message: '上传成功',
                type: "success",
                duration: 3000
            })
        } else {
            ElNotification({
                title: "很遗憾",
                message: res.message,
                type: "error",
                duration: 3000
            })
            item.uploading = false
        }
    }).catch((err) => {
        item.uploading = false
        ElNotification({
            title: "很遗憾",
            message: err.message,
            type: "error",
            duration: 3000
        })
    })
    uploadRef.value.clearFiles()
}

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
    position: relative;
}

.table-wrap {
    height: 90%;
}

.pagination-wrap {
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 36px;
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