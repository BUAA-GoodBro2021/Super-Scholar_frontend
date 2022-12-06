<template>
    <div class="collection-body">
        <div class="video-container">
            <el-card shadow="hover" style="width: 100%; height: 100%;">
                <div class="content-wrap">
                    <!-- 按钮与面包屑 -->
                    <div class="video-header clearfix">
                        <div class="header-top">
                            <!-- 新建文件夹 需要处理进入到收藏夹内部时候 -->
                            <el-button type="primary" @click="addConfirm()" v-if="pageOne">
                                {{ '新建收藏夹' }}
                            </el-button>
                            <el-button type="primary" @click="backToRoot(true)" v-if="!pageOne">
                                {{ '返回上一级' }}
                            </el-button>
                            <!-- 重命名 -->
                            <el-button v-show="pageOne && hasSelect" style="margin-left:10px" type="primary"
                                @click="ChangeNameConfirm()" :disabled="(selects.length != 1)">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                                {{ '重命名' }}
                            </el-button>

                            <!-- 删除 -->
                            <el-button v-show="hasSelect" style="margin-left:10px" @click="(deleteDialog = true)"
                                type="danger">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                                {{ '删除' }}
                            </el-button>
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

                        <div class="breadcrumb">
                            <!-- 面包屑 这里只起到展示作用 不可点击 -->
                            <el-breadcrumb :separator-icon="ArrowRight">
                                <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
                                    <span :class="(index === breadcrumbList.length - 1) ? 'breadcrumb-link-active' : ''"
                                        class="breadcrumb-link" @click="backToRoot(index == 0)">{{ item }}</span>
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                    </div>

                    <div v-loading="loading" class="video-main" v-show="pageOne">
                        <ul class="list">
                            <li v-for="(file, index) in filterFiles" :key="index" :class="{ active: file.active }"
                                class="list-item" @dblclick="dbClickOpenFile(file)">
                                <div class="inner">
                                    <i class="icon-folder"></i>
                                    <div class="hover-cover">
                                        <span class="hover-cover-text">{{ file.sum }}</span>
                                    </div>
                                </div>
                                <i class="icon-file-selected" @click="SelectItem(file)"></i>
                                <div class="file-name">
                                    <span :title="file.name">{{ file.name }}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-loading="loading" class="video-main" v-show="!pageOne">
                        <ul class="search-result__list">
                            <!-- 单个搜索结果卡片 -->
                            <li v-for="(item, index) in filterWorkList" :key="index" class="result-item">
                                <WorksResCardVue :item="item" :class="{active: item.active}" :notInCollection="false"/>
                                <i class="icon-work-selected" :class="{workiconactive: item.active}" @click="SelectItem(item)"></i>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-card>
            <!-- 重命名弹出框 -->
            <el-dialog v-model="changeDialog">
                <template #header center>
                    <span class="dialog-title">重命名</span>
                </template>
                <el-input v-model="changeName" max="10" show-word-limit></el-input>
                <div style="display: flex; justify-content: center; margin-top: 20px; ">
                    <el-button @click="handleChangeName()" type="primary">确定</el-button>
                    <el-button @click="changeDialog = false">取消</el-button>
                </div>
            </el-dialog>
            <!-- 新增弹出框 -->
            <el-dialog v-model="addDialog">
                <template #header center>
                    <span class="dialog-title">新建收藏夹</span>
                </template>
                <el-input v-model="changeName" max="10" show-word-limit></el-input>
                <div style="display: flex; justify-content: center; margin-top: 20px;">
                    <el-button @click="addFolder()" type="primary">确定</el-button>
                    <el-button @click="addDialog = false">取消</el-button>
                </div>
            </el-dialog>
            <!-- 删除弹出框 -->
            <el-dialog v-model="deleteDialog">
                <template #header center>
                    <span class="dialog-title">确定删除？</span>
                </template>
                <div style="display: flex; justify-content: center; ">
                    <el-button @click="deleteFile()" type="danger">确定</el-button>
                    <el-button @click="deleteDialog = false">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script setup>
import { ArrowRight, Plus, Edit, Delete, Search } from '@element-plus/icons-vue';
import { sliderEmits } from 'element-plus';
import { Collection } from '../../api/collect'
import WorksResCardVue from '../search/WorksResCard.vue';
const pageOne = ref(true) // 第几页
const hasSelect = ref(false) // 是否有选中的元素
const selects = ref([]) //选中的元素
const keyWord = ref('') //搜索框的输入字符串
const breadcrumbList = ref(['root']) //面包屑list
const loading = ref(false) //是否加载
const pageIndex = ref(1)
const total = ref(1000)
const changeDialog = ref(false)
const addDialog = ref(false)
const deleteDialog = ref(false)
const changeName = ref('')
const filterWorkList = ref([]) // 过滤后的文献列表
const workList = ref([]) // 文献列表
const fileNow = ref() // 目前在哪个文件夹里面
const filterFiles = ref([]) // 过滤后的文件夹
const files = ref([
    {
        active: false,
        type: 0,
        size: 122,
        sum: 2,
        id: 1,
        name: 'Harbour'
    },
    {
        active: false,
        type: 0,
        size: 122,
        sum: 2,
        id: 2,
        name: 'Harboure'
    },
    {
        active: false,
        type: 1,
        size: 122,
        sum: 2,
        id: 3,
        name: 'Harbur'
    },
    {
        active: false,
        type: 1,
        size: 122,
        sum: 2,
        id: 4,
        name: 'Harboure'
    },
])

onMounted(() => {
    getCollectionList()
})

// 重置被选中的选项
const resetSelect = () => {
    hasSelect.value = false
    selects.value.forEach((el) => {
        el.active = false
    })
    selects.value = []
}

// ReStart
const getCollectionList = async () => {
    Collection.GetCollection().then((res) => {
        if (res.data.result == 1) {
            // active预处理 赋值 filterfiles赋值
            files.value = []
            filterFiles.value = []
            files.value.push(...res.data.package_list)
            filterFiles.value.push(...res.data.package_list)
            resetSelect()
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

// 修改名字
const ChangeNameConfirm = () => {
    changeName.value = ''
    changeDialog.value = true
}

// 修改名字
const handleChangeName = () => {
    // 文件重命名操作
    // 当激活项里只有唯一的一个元素，遍历files，通过id就可以找到该项需要重命名的name
    if (changeName.value == '') {
        ElNotification({
            title: "请输入名称",
            message: "请输入名称",
            type: "error",
            duration: 3000
        })
        return
    }
    Collection.RenameCollection({
        package_name: changeName.value,
        package_id: selects.value[0].id
    }).then((res) => {
        if (res.data.result == 1) {
            getCollectionList()
            changeDialog.value = false
            changeName.value = ''
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
    changeDialog.value = false
    changeName.value = ''
}

//添加收藏夹
const addConfirm = () => {
    changeName.value = ''
    addDialog.value = true
}

//添加收藏夹
const addFolder = () => {
    // 新增文件夹 todo 新建文件夹接口
    if (changeName.value == '') {
        ElNotification({
            title: "请输入名称",
            message: "请输入名称",
            type: "error",
            duration: 3000
        })
        return
    }
    Collection.AddCollection({
        package_name: changeName.value
    }).then((res) => {
        if (res.data.result == 1) {
            getCollectionList()
            addDialog.value = false
            changeName.value = ''
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
    addDialog.value = false
    changeName.value = ''
}

// 删除收藏夹或者是收藏的文献
const deleteFile = async () => {
    if (pageOne.value) {
        // 删除收藏夹
        let packages = []
        selects.value.forEach((el) => {
            packages.push(el.id)
        })
        // console.log(JOSN.stringfy(packages))
        Collection.DeleteCollection({
            package_id_list: packages
        }).then((res) => {
            if (res.data.result == 1) {
                getCollectionList()
                deleteDialog.value = false
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
        deleteDialog.value = false
    } else {
        let works = []
        selects.value.forEach((el) => {
            works.push(el.id.substring(21))
        })
        Collection.CancelDocument({
            work_id_list: works,
            package_id: fileNow.value.id
        }).then((res) => {
            if (res.data.result == 1) {
                resetSelect()
                RemoveWorks(works) // 否则还要等待GetCollection()
                deleteDialog.value = false
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
}

// 删除之后在前端移除相关信息 works是openalexid的list
const RemoveWorks = (works) => {
    works.forEach((item) => {
        // 从后往前防止index变化带来的误差
        for(let i = workList.value.length - 1; i >= 0; i--) {
            if(workList.value[i].id.substring(21) == item) workList.value.splice(i, 1);
        }
        for(let i = filterWorkList.value.length - 1; i >= 0; i--) {
            if(filterWorkList.value[i].id.substring(21) == item) filterWorkList.value.splice(i, 1);
        }
    })
}

// 清空搜索框时候的重置行为
const resetItems = () => {
    // todo 展示全部的列表 回归初始状态
    if (pageOne.value) {
        filterFiles.value = []
        filterFiles.value.push(...files.value)
    } else {
        filterWorkList.value = []
        filterWorkList.value.push(...workList.value)
    }
}

// 搜索指定的目标
const searchItems = () => {
    // 搜索之前重置被选中的选项
    if (keyWord.value == '') return
    resetSelect()
    if (pageOne.value) {
        filterFiles.value = []
        files.value.forEach((el) => {
            if (el.name.includes(keyWord.value)) filterFiles.value.push(el)
        })
    } else {
        filterWorkList.value = []
        workList.value.forEach((el) => {
            if(el.display_name.includes(keyWord.value)) filterWorkList.value.push(el)
        })
    }
}

//双击收藏夹进入
const dbClickOpenFile = (item) => {
    // todo 双击文件夹进入 更新文献列表和面包屑以及导航栏
    breadcrumbList.value.push(item.name)
    keyWord.value = ''
    pageOne.value = false
    // 重置激活选项
    resetSelect()
    //获取文献列表
    fileNow.value = item // 记录当前文件夹
    getDocumentList()
}

// 返回到收藏夹列表
const backToRoot = (type) => {
    if (type) {
        breadcrumbList.value.splice(1, 1)
        pageOne.value = true
        keyWord.value = ''
        resetSelect()
        getCollectionList()
    }
}

// 点击对号 选择某个文件夹或者是文献
const SelectItem = (item) => {
    //如果在第一页 则是将收藏夹放在selects中  id name owner sum works[]
    //第二页相同 将work实体放在selects中 displayname id.substring(21) 使用id作为唯一key完全没问题
    //如果已经放入则是二次点击 取消激活状态
    for (let i = 0; i < selects.value.length; i++) {
            if (selects.value[i].id == item.id) {
                selects.value.splice(i, 1)
                item.active = false
                if (selects.value.length == 0) hasSelect.value = false
                return
            }
        }
        // 转换为激活状态
        item.active = true
        selects.value.push(item)
        hasSelect.value = true
}

//获取文献列表 先清空文献列表 然后重新拉取
//进入一个收藏夹的时候拉取列表 或者是删除导致重新进入收藏夹而拉取列表
const getDocumentList = () => {
    workList.value = []
    filterWorkList.value = []
    let works = fileNow.value.works
    if (works.length == 0) return

    let work_ids = works[0]
    for (let i = 1; i < works.length; i++) work_ids = work_ids + "|" + works[i]
    let data = {
        entity_type: 'works',
        params: {
            filter: {
                openalex: work_ids
            },
            page: 1,
            per_page: works.length
        }
    }
    Collection.GetDocumentList(data).then((res) => {
        if (res.data.result == 1) {
            // active预处理 赋值 filterfiles赋值
            workList.value.push(...res.data.list_of_data[0].results)
            filterWorkList.value.push(...res.data.list_of_data[0].results)
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

// const handleCurrentChange = () => {
//     console.log('pageChange')
// }

// 跳转
const toArticle = (item) => {

}

const toAuthor = (item) => {

}

const toConcept = (item) => {

}

</script>
   
<style scoped>
.hover-item {
    cursor: pointer;
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
    height: 150px;
    width: 120px;
    margin: 10px;
    display: inline-block;
    cursor: pointer;
}

/* 每一个文件夹名字上方的部分 */
.video-container .video-main .list-item .inner {
    height: 90px;
    width: 90px;
    margin: 7.5px 15px;
}

/* 文件夹图标 */
.video-container .video-main .list-item .inner .icon-folder {
    display: inline-block;
    width: 90px;
    height: 90px;
    background-image: url('../../assets/icons/folder2.svg');
    background-size: 100% 100%;
}

.video-container .video-main .list-item .inner .icon-thumb {
    width: 90px;
    height: 90px;
}

.video-container .video-main .list-item .file-name {
    padding-left: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #424e67;
    font-size: 18px;
    font-weight: 400;
}

.video-container .video-main .list-item .file-name:hover {
    color: #409eff;
}

.video-container .video-main .hover-cover {
    width: 75px;
    height: 45px;
    position: absolute;
    left: 15px;
    top: 36px;
    /* background-color: rgb(34, 34, 34); */
    opacity: 0;
    text-align: center;
    line-height: 45px;
    font-size: 20px;
}

.video-container .video-main .hover-cover-text {
    color: #424e67;
}

.video-container .video-main .list-item:hover {
    background-color: #f1f5fa;
}


/* 鼠标悬浮时收藏夹勾选图标透明度发生变化 */
.video-container .video-main .list-item:hover .icon-file-selected {
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
    width: 25px;
    height: 25px;
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
    width: 25px;
    height: 25px;
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
    top: 1.625rem;
    display: inline-block;
    width: 2rem;
    height: 2rem;
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

/* icon-work选中的时候 */
.video-container .video-main .workiconactive {
    position: absolute;
    right: 5px;
    top: 1.625rem;
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background-size: 100% 100%;
    background-image: url(../../assets/icons/select.svg);
    opacity: 1 !important;
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


/* #region 搜索列表和单个搜索卡片 */
.search-result__list {
    list-style: none;
    padding: 0;
    margin: 0;
    height: 100%;
    overflow-y: scroll;
}

.search-result__list .result-item {
    width: 100%;
    display: inline-block;
    font-size: .875rem;
    position: relative;
    margin-left: 0 !important;
}

.video-container .video-main .result-item-card {
    margin-left: 2px;
}

.video-container .video-main .result-item-card:hover {
    background-color: #f1f5fa;
}

:deep(.video-container .video-main .result-item-card .card-title) {
    max-width: calc(100% - 32px);
}

/* 鼠标悬浮时文献勾选图标透明度发生变化 */
.video-container .video-main .result-item:hover .icon-work-selected {
    opacity: 0.3;
}

.result-item-checkbox-container {
    position: relative;
    top: 1.5625rem;
}

/* #endregion 卡片底部右侧快捷操作 */

/* #endregion 搜索列表和单个搜索卡片结束 */

/* #endregion 搜索结果区域结束 */
</style>