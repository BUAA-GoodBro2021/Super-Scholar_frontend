<!--多媒体素材首页 -->
<template>
    <div class="video-container">
        <el-card shadow="hover">
            <div class="video-header clearfix">
                <div class="header-top">
                    <!-- 新建文件夹 需要处理进入到收藏夹内部时候 -->
                    <el-button type="primary" @click="addConfirm()" v-show="pageOne">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        {{ '新建收藏夹' }}
                    </el-button>
                    <!-- 重命名 -->
                    <el-button v-show="pageOne && hasSelect" style="margin-left:10px" type="primary"
                        @click="ChangeNameConfirm()">
                        <el-icon>
                            <Edit />
                        </el-icon>
                        {{ '重命名' }}
                    </el-button>

                    <!-- 删除 -->
                    <el-button v-show="hasSelect" style="margin-left:10px" @click="handleDeleteFile()">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        {{ '删除' }}
                    </el-button>
                    <div class="fr">
                        <el-input v-model="keyWord" :placeholder="'名称'" style="width:150px;margin-left:10px;" clearable
                            @clear="resetGetMaterialPage()"></el-input>
                        <!-- 查询 -->
                        <el-button type="primary" style="margin-left:2px" @click="queryMaterialPage()">
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
                                class="breadcrumb-link">{{ item }}</span>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>

            <div v-loading="loading" class="video-main">
                <ul class="list">
                    <li v-for="(file, index) in files" :key="index" :class="{ active: file.active }" class="list-item"
                        @dblclick="dbClickOpenFile(file)">
                        <div class="inner">
                            <i class="icon-folder" v-show="file.type == 0"></i>
                            <div v-show="file.type > 0" class="hover-cover">
                                <span style="color:#fff;">{{ file.size }}</span>
                            </div>
                        </div>
                        <i class="icon-file-selected" @click="SelectItem(file)"></i>
                        <div class="file-name">
                            <span :title="file.name">{{ file.name }}</span>
                        </div>
                    </li>
                </ul>
                <!-- 分页 -->
                <el-pagination layout="prev, pager, next" :total="total" @current-change="handleCurrentChange()"
                    v-model:current-page="pageIndex" hide-on-single-page
                    :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" />
            </div>
        </el-card>
        <!-- 重命名弹出框 -->
        <el-dialog v-model="changeDialog">
            <template #header center>
                <span class="dialog-title">重命名</span>
            </template>
            <el-input v-model="changeName" max="10" show-word-limit></el-input>
            <div style="display: flex; justify-content: center; ">
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
            <div style="display: flex; justify-content: center; ">
                <el-button @click="addFolder()" type="primary">确定</el-button>
                <el-button @click="addDialog = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
   
<script setup>
import { ArrowRight, Plus, Edit, Delete, Search } from '@element-plus/icons-vue'
const pageOne = ref(true) // 第几页
const hasSelect = ref(true) // 是否有选中的元素
const selects = ref([]) //选中的元素
const keyWord = ref('') //搜索框的输入字符串
const breadcrumbList = ref(['one', 'two']) //面包屑list
const loading = ref(false) //是否加载
const pageIndex = ref(1)
const total = ref(1000)
const changeDialog = ref(false)
const addDialog = ref(false)
const changeName = ref('')
const files = ref([
    {
        active: true,
        type: 0,
        size: 122,
        id: 1,
        name: 'Harbour'
    },
    {
        active: false,
        type: 0,
        size: 122,
        id: 1,
        name: 'Harboure'
    },
    {
        active: true,
        type: 1,
        size: 122,
        id: 1,
        name: 'Harbur'
    },
    {
        active: false,
        type: 1,
        size: 122,
        id: 1,
        name: 'Harboure'
    },
])

// ReStart
const ChangeNameConfirm = () => {
    changeName.value =''
    changeDialog.value = true
}
const handleChangeName = () => {
    // 文件重命名操作
    // 当激活项里只有唯一的一个元素，遍历files，通过id就可以找到该项需要重命名的name

    changeDialog.value = false
    changeName.value = ''
}

const addConfirm = () => {
    changeName.value = ''
    addDialog.value = true
}

const addFolder = () => {
    // 新增文件夹 todo 新建文件夹接口
    addDialog.value = false
    changeName.value = ''
}

const handleDeleteFile = () => {
    // 删除文件夹 需要先弹出框

}

const resetGetMaterialPage = () => {
    // todo 展示全部的列表 回归初始状态
}

const queryMaterialPage = () => {
    // todo查询
}

const dbClickOpenFile = () => {
    // todo 双击文件夹进入 更新文献列表和面包屑以及导航栏
    console.log('double click')
}

const SelectItem = (item) => {
    
    //todo 找到与Vue.set相同的提供激活手段
    // 切换选择文件或文件夹的激活样式
    // this.id = id
    //     if (item.active) {
    //       Vue.set(item, 'active', false) // 为item添加不存在的属性，需要使用vue提供的Vue.set( object, key, value )方法
    //       const index = this.activeItems.indexOf(id)
    //       if (index > -1) {
    //         this.activeItems.splice(index, 1)
    //       }
    //     } else {
    //       Vue.set(item, 'active', true)
    //       this.activeItems.push(id)
    //     }
    //     if (this.activeItems.length > 0) {
    //       // 当有文件被激活时，显示重命名，删除，移动操作按钮
    //       this.activeFlag = true
    //     } else {
    //       this.activeFlag = false
    //     }
    //     if (this.activeItems.length > 1) {
    //       // 当有两个以上的文件被选中的时候，重命名，移动操作按钮不可用
    //       this.activeFlagNotReame = true
    //     } else {
    //       this.activeFlagNotReame = false
    //     }
    //     this.activeFlagMoveble = true
    //     this.files.forEach(item => {
    //       if (item.active) {
    //         if (item.resType !== 0) {
    //           // 只要有一个不是文件夹的被选中，就可以移动
    //           this.activeFlagMoveble = false
    //         }
    //       }
    //     })

}

const handleCurrentChange = () => {
    console.log('pageChange')
}

</script>
   
<style lang="scss" scoped>
.clearfix:after {
    content: '';
    display: block;
    clear: both;
}

.video-container {
    min-width: 630px;
    width: 80%;
    margin: 10px;

    .video-header {
        padding: 0 0 5px 0;
        border-bottom: 1px solid #dbdbdb;

        .breadcrumb {
            // float: left;
            height: 20px;
            margin-top: 10px;

            .breadcrumb-link {
                cursor: pointer;
                //font-size: 16px;
            }

            .breadcrumb-link:hover {
                color: #409eff;
                text-decoration: underline;
            }

            .breadcrumb-link-active {
                // 面包屑当前激活文件夹的样式
                font-weight: 700;
            }
        }

        .header-top {
            // float: right;
            height: 40px;
            line-height: 40px;
            position: relative;

            .fr {
                position: absolute;
                right: 0;
                top: 0;
            }
        }
    }

    .video-main {
        .list-item {
            border: 1px solid #fff;
            box-sizing: border-box;
            position: relative;
            height: 100px;
            width: 80px;
            // background-color: green;
            margin: 5px;
            display: inline-block;
            cursor: pointer;

            .inner {
                height: 60px;
                width: 60px;
                // background-color: red;
                margin: 5px 10px;

                // padding: 10px 15px 10px 15px;
                .icon-folder {
                    // 文件夹的样式
                    display: inline-block;
                    width: 60px;
                    height: 60px;
                    background-image: url(../../assets/icons/folder2.svg);
                    background-size: 100% 100%;
                }

                .icon-thumb {
                    // 文件的样式
                    width: 60px;
                    height: 60px;
                }
            }

            .file-name {
                // 文件夹name样式
                padding-left: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #424e67;
                font-size: 12px;
            }

            .file-name:hover {
                color: #409eff;
            }
        }

        .hover-cover {
            width: 60px;
            height: 60px;
            position: absolute;
            left: 10px;
            top: 5px;
            background-color: rgb(0, 0, 0);
            opacity: 0;
            text-align: center;
            line-height: 60px;
            font-size: 12px;
        }

        .list-item:hover {
            background-color: #f1f5fa;

            .icon-file-selected {
                opacity: 0.5;
            }

            .hover-cover {
                opacity: 0.6;
            }
        }

        .icon-file-selected {
            // 小圆点默认样式
            position: absolute;
            left: 5px;
            top: 5px;
            display: inline-block;
            width: 20px;
            height: 20px;
            background-size: 100% 100%;
            ;
            background-image: url(../../assets/icons/select.svg);
            opacity: 0;
        }

        .icon-file-selected:hover {
            // 小圆点hover
            opacity: 1 !important;
        }

        .active {
            // 选择文件触发激活样式
            border: 1px solid #409eff;
            border-radius: 8px;

            .icon-file-selected {
                position: absolute;
                left: 5px;
                top: 5px;
                display: inline-block;
                width: 20px;
                height: 20px;
                background-size: 100% 100%;
                background-image: url(../../assets/icons/select.svg);
                opacity: 1;
            }
        }

        .active:hover {

            // 激活状态小圆点透明度1
            .icon-file-selected {
                opacity: 1 !important;
            }
        }

        .loadding-message {
            // 加载loading的文字样式
            color: #424e67;
            font-size: 12px;
            text-align: center;
        }
    }
}
</style>