<template>
    <div v-if="isLoading">
        <SandboxLoading />
    </div>
    <div class="collection-body">
        <div class="video-container">
            <el-card shadow="hover" style="width: 100%; height: 100%;">
                <div class="content-wrap">
                    <!-- 按钮与面包屑 -->
                    <div class="video-header clearfix">
                        <div class="header-top">
                            <div class="fr">
                                <el-input v-model="keyWord" :placeholder="'名称'" style="width:150px;margin-left:10px;"
                                    clearable @clear="resetItems()"></el-input>
                                <!-- 查询 -->
                                <el-button type="primary" style="margin-left:2px" @click="searchItems()">
                                    <el-icon>
                                        <Search />
                                    </el-icon>{{ '查询' }}
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <!-- 主体部分 -->
                    <div v-loading="loading" class="video-main">
                        <el-table :data="filterusers" style="width: 100%; height: 100%;">
                            <el-table-column prop="display_name" label="姓名" min-width="20%">
                                <template #default="scope">
                                    <span class="user-name hover-item" @click="toAuthor(scope.row)">{{
                                            scope.row.display_name
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="last_known_institution" label="机构" min-width="25%" align="center">
                                <template #default="scope">
                                    <span class="organizaton hover-item" @click="toOrganization(scope.row)">{{
                                            scope.row.last_known_institution ? scope.row.last_known_institution.display_name
                                                : '暂无机构信息'
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="works_count" label="发表文献" min-width="18%" align="center" />
                            <el-table-column prop="cited_by_count" label="引用量" min-width="18%" align="center" />
                            <el-table-column prop="pdf" label="操作" min-width="18%">
                                <template #default="scope">
                                    <el-tag style="cursor: pointer;" @click="CancelConfrim(scope.row)">取消关注</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-card>
            <!-- 删除弹出框 -->
            <el-dialog v-model="deleteDialog">
                <template #header center>
                    <span class="dialog-title">确定取消关注？</span>
                </template>
                <div style="display: flex; justify-content: center; ">
                    <el-button @click="deleteUser()" type="danger">确定</el-button>
                    <el-button @click="deleteDialog = false">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script setup>
import SandboxLoading from "../../components/Loading/SandboxLoading.vue";
import { ArrowRight, Plus, Edit, Delete, Search } from '@element-plus/icons-vue';
import { sliderEmits } from 'element-plus';
import { User } from '../../api/userDetail'
const router = useRouter()
const keyWord = ref('') //搜索框的输入字符串
const breadcrumbList = ref(['root']) //面包屑list
const loading = ref(false) //是否加载
const deleteDialog = ref(false)
const isLoading = ref(true)

const userNow = ref()
const filterusers = ref([]) // 过滤后的文件夹
const userids = ref([])
const users = ref([])

onMounted(() => {
    getAuthorList()
})

const getAuthorList = async () => {
    User.GetFollowList({}).then((res) => {
        if (res.data.result == 1) {
            // active预处理 赋值 filterusers赋值
            if(res.data.follow_id_list.length == 0) isLoading.value = false
            userids.value = []
            userids.value.push(...res.data.follow_id_list)
            getAuthorEntityList()
            // searchItems()
        } else {
            ElNotification({
                title: res.message,
                message: res.message,
                type: "error",
                duration: 3000
            })
        }
    }).catch((err) => {
        ElNotification({
            title: err.message,
            message: err.message,
            type: "error",
            duration: 3000
        })
    })
}

const getAuthorEntityList = async () => {
    if (userids.value.length == 0) return
    let userId = userids.value[0]
    for (let i = 1; i < userids.value.length; i++) userId = userId + '|' + userids.value[i]
    let data = {
        entity_type: 'authors',
        params: {
            filter: {
                openalex_id: userId
            },
            page: 1,
            per_page: userids.value.length
        }
    }
    User.GetAuthorEntity(data).then((res) => {
        isLoading.value = false
        if (res.data.result == 1) {
            users.value = []
            filterusers.value = []
            users.value.push(...res.data.list_of_data[0].results)
            filterusers.value.push(...res.data.list_of_data[0].results)
        } else {
            ElNotification({
                title: res.message,
                message: res.message,
                type: "error",
                duration: 3000
            })
        }
    }).catch((err) => {
        ElNotification({
            title: err.message,
            message: err.message,
            type: "error",
            duration: 3000
        })
    })
}

// 清空搜索框时候的重置行为
const resetItems = () => {
    // todo 展示全部的列表 回归初始状态
    filterusers.value = []
    filterusers.value.push(...users.value)
}

// 搜索指定的目标
const searchItems = () => {
    // 搜索之前重置被选中的选项
    if (keyWord.value == '') return
    filterusers.value = []
    users.value.forEach((el) => {
        if (el.display_name.includes(keyWord.value)) filterusers.value.push(el)
    })
}

const CancelConfrim = (item) => {
    deleteDialog.value = true
    userNow.value = item
}

const deleteUser = () => {
    User.CancelFollow({
        author_id: userNow.value.id.substring(21)
    }).then((res) => {
        if (res.data.result == 1) {
            console.log(users.value, filterusers.value, userNow.value)
            removeItem()
        } else {
            ElNotification({
                title: res.message,
                message: res.message,
                type: "error",
                duration: 3000
            })
        }
    }).catch((err) => {
        ElNotification({
            title: err.message,
            message: err.message,
            type: "error",
            duration: 3000
        })
    })
    deleteDialog.value = false
}

const removeItem = () => {
    for (let i = filterusers.value.length - 1; i >= 0; i--) {
        if (filterusers.value[i].id.substring(21) == userNow.value.id.substring(21)) {
            filterusers.value.splice(i, 1)
        }
    }

    for (let i = users.value.length - 1; i >= 0; i--) {
        if (users.value[i].id.substring(21) == userNow.value.id.substring(21))
            users.value.splice(i, 1)
    }

    userNow.value = null
}

// const handleCurrentChange = () => {
//     console.log('pageChange')
// }

// 跳转

const toAuthor = (item) => {
    let { href } = router.resolve({
        name: 'OpenAlexAuthorDetail',
        params: { tokenid: item.id.substring(21) }
    })
    window.open(href, "_blank")
}

const toOrganization = (item) => {
    if(!item.last_known_institution) return
    let { href } = router.resolve({
        name: 'InstitutionDetail',
        params: { institutionid: item.last_known_institution.id.substring(21) }
    })
    window.open(href, "_blank")
}


</script>
   

<style scoped>
.hover-item {
    cursor: pointer;
}

.hover-item:hover {
    color: #409eff;
}

.collection-body {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
}

:deep(.el-card__body) {
    height: 100%;
}

.content-wrap {
    width: 100%;
    height: 100%;
    position: relative;
}

.clearfix:after {
    content: '';
    display: block;
    clear: both;
}

.video-container {
    min-width: 630px;
    width: 80%;
    margin: 10px;
}

.video-container .video-header {
    padding: 0 0 5px 0;
    border-bottom: 1px solid #dbdbdb;
}

.video-container .video-header .breadcrumb {
    height: 20px;
    margin-top: 10px;
}

.video-container .video-header .breadcrumb .breadcrumb-link {
    cursor: pointer;
}

.video-container .video-header .breadcrumb .breadcrumb-link:hover {
    color: #409eff;
    text-decoration: underline;
}

.video-container .video-header .breadcrumb .breadcrumb-link-active {
    font-weight: 700;
}

.video-container .video-header .header-top {
    height: 40px;
    line-height: 40px;
    position: relative;
}

.video-container .video-header .header-top .fr {
    position: absolute;
    right: 0;
    top: 0;
}

.pagination-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 2px;
}

/* header和面包屑的高度是76 */
.video-container .video-main {
    width: 100%;
    height: calc(100% - 76px);
}

.video-container .video-main .list {
    list-style: none;
    overflow-y: scroll;
    height: 100%;
}

::-webkit-scrollbar {
    width: 0 !important;
}

::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
}

/* 每一个文件夹的框 */
.video-container .video-main .list-item {
    border: 1px solid #fff;
    box-sizing: border-box;
    position: relative;
    height: 100px;
    width: 80px;
    margin: 10px;
    display: inline-block;
    cursor: pointer;
}

/* 每一个文件夹名字上方的部分 */
.video-container .video-main .list-item .inner {
    height: 60px;
    width: 60px;
    margin: 5px 10px;
}

/* 文件夹图标 */
.video-container .video-main .list-item .inner .icon-folder {
    display: inline-block;
    width: 60px;
    height: 60px;
    background-image: url('../../assets/icons/folder2.svg');
    background-size: 100% 100%;
}

.video-container .video-main .list-item .inner .icon-thumb {
    width: 60px;
    height: 60px;
}

.video-container .video-main .list-item .file-name {
    padding-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #424e67;
    font-size: 12px;
}

.video-container .video-main .list-item .file-name:hover {
    color: #409eff;
}

.video-container .video-main .hover-cover {
    width: 50px;
    height: 30px;
    position: absolute;
    left: 10px;
    top: 24px;
    background-color: rgb(34, 34, 34);
    opacity: 0;
    text-align: center;
    line-height: 30px;
    font-size: 20px;
}

.video-container .video-main .list-item:hover {
    background-color: #f1f5fa;
}

.video-container .video-main .result-item-card:hover {
    background-color: #f1f5fa;
}

/* 鼠标悬浮时收藏夹勾选图标透明度发生变化 */
.video-container .video-main .list-item:hover .icon-file-selected {
    opacity: 0.5;
}

/* 鼠标悬浮时文献勾选图标透明度发生变化 */
.video-container .video-main .result-item:hover .icon-work-selected {
    opacity: 0.5;
}


.video-container .video-main .list-item:hover .hover-cover {
    opacity: 0.6;
}


.video-container .video-main .icon-file-selected {
    position: absolute;
    right: 5px;
    top: 5px;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: 100% 100%;
    background-image: url(../../assets/icons/select.svg);
    opacity: 0;
}

.video-container .video-main .icon-file-selected:hover {
    opacity: 1 !important;
}

.video-container .video-main .active {
    border: 2px solid #409eff;
    border-radius: 8px;
}

.video-container .video-main .active .icon-file-selected {
    position: absolute;
    right: 5px;
    top: 5px;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: 100% 100%;
    background-image: url(../../assets/icons/select.svg);
    opacity: 1;
}

.video-container .video-main .active:hover .icon-file-selected {
    opacity: 1 !important;
}

/* work勾选图标样式start */

.video-container .video-main .icon-work-selected {
    position: absolute;
    right: 5px;
    top: .9125rem;
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background-size: 100% 100%;
    background-image: url(../../assets/icons/select.svg);
    /* background-color: greenyellow; */
    opacity: 0;
    /* z-index: 100; */
}

.video-container .video-main .icon-work-selected:hover {
    opacity: 1 !important;
}

/* todo */
.video-container .video-main .active {
    border: 1px solid #409eff;
    border-radius: 8px;
}

.video-container .video-main .active .icon-work-selected {
    position: absolute;
    right: 5px;
    top: .9125rem;
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background-size: 100% 100%;
    background-image: url(../../assets/icons/select.svg);
    opacity: 1;
}

.video-container .video-main .active:hover .icon-work-selected {
    opacity: 1 !important;
}

/* work勾选图标样式end */

.video-container .video-main .loadding-message {
    color: #424e67;
    font-size: 12px;
    text-align: center;
}

</style>