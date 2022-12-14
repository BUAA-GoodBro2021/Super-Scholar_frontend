<template>
    <el-row style="width:100%;height:100%;padding:0px" align="middle" justify="space-around">
        <el-col :sm="24" :lg="12" :xl="6">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="下载PDF"
            placement="bottom"
          >
            <el-button :type="paperInfo.open_access.is_oa==-1?'danger':'success'" class="btn"  :disabled="paperInfo.open_access.is_oa==-1" @click="download"><el-icon color="black" size="large"><Download /></el-icon></el-button>
          </el-tooltip>
        </el-col>
        <el-col :sm="24" :lg="12" :xl="6">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="跳转到OpenAlex"
            placement="bottom"
          >
            <el-button type="success" class="btn"  @click="openAlex"><el-icon  color="black" size="large"><View /></el-icon></el-button>
          </el-tooltip>
        </el-col>
        <el-col :sm="24" :lg="12" :xl="6">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="收藏"
            placement="bottom"
          >
            <el-button type="success" class="btn" @click="star"><el-icon color="black" size="large"><Star v-if="amInList.length == 0"/><StarFilled v-else/></el-icon></el-button>
          </el-tooltip>
        </el-col>
        <el-col :sm="24" :lg="12" :xl="6">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="获取BiBTeX引用"
            placement="bottom"
          >
            <el-button type="success"  class="btn" @click="getBiBTeX(paperInfo), bibtexDialogVisible = true"><el-icon color="black" size="large"><Share /></el-icon></el-button>
          </el-tooltip>
        </el-col>
    </el-row>


    <teleport to='body' >
        <!-- 蒙版 -->
        <transition name="fade">
          <div v-if="bibtexDialogVisible" class="dialog-container" @click="bibtexDialogVisible = false"></div>
        </transition>
        <!-- 浮窗 -->
        <transition name="up">
          <div v-if="bibtexDialogVisible" class="dialog-window">
            <!-- 标题 -->
            <div class="dialog-title">BiBTeX 引用格式</div>
            <!-- 文本 -->
            <div class="dialog-content" style="white-space: pre-wrap;">{{ bibtex }}</div>
            <!-- 按钮 -->
            <div class="dialog-btn-wrapper">
              <button class="dialog-cancel-btn" @click="bibtexDialogVisible = false" style="margin-right: 8px;">
                Cancel
                <span></span>
              </button>
              <button class="dialog-confirm-btn" @click="copy(bibtex)" style="margin-right: 8px;">
                {{ !copied ? 'CopyBib': 'Copied!' }}
                <span></span>
              </button>
            </div>
          </div>
        </transition>
      </teleport>

      <teleport to='body' >
        <!-- 蒙版 -->
        <transition name="fade">
          <div v-if="starDialogVisible" class="dialog-container" @click="starDialogVisible = false"></div>
        </transition>
        <!-- 浮窗 -->
        <transition name="up" v-loading="loading">
          <div v-if="starDialogVisible" class="dialog-window">
            <!-- 标题 -->
            <div class="dialog-title">收藏此文献</div>
            <!-- 文本 -->
            <div v-if="collections.length != 0" class="dialog-content" style="white-space: pre-wrap;">
                <el-scrollbar max-height="400px">
                  
                <el-checkbox class="cb" v-for="(collection, index) in collections" :key="index" @change="starChanged(collection)" :checked="amInList.find((col,idx,arr)=>{return col.package_id == collection.id})!=null" size="large" style="width:90%;margin-bottom:20px;margin-left:20px;" border>
                    <el-tag
                        type="info"
                        effect="light"
                        round
                    >{{collection.sum}}</el-tag>
                    &nbsp;&nbsp;&nbsp;
                    {{collection.name}}
                    
                </el-checkbox>
            </el-scrollbar>
            </div>
            <div v-else>
              您还没有创建收藏夹。
            </div>
            <!-- 按钮 -->
            <div class="dialog-btn-wrapper">
              <button class="dialog-cancel-btn" @click="starDialogVisible = false" style="margin-right: 8px;">
                取消
                <span></span>
              </button>
              <button class="dialog-confirm-btn" @click="likeIt();starDialogVisible = false" style="margin-right: 8px;">
                确定
                <span></span>
              </button>
            </div>
          </div>
        </transition>
      </teleport>

</template>
<script setup>

import {
Download,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
import { Collection } from "../../api/collect";
const props = defineProps({
    paperInfo: Object,
  });
function download(){
    if(!props.paperInfo.open_access.oa_url)
        return;
    window.open(props.paperInfo.open_access.oa_url);
}
function openAlex(){
    window.open(props.paperInfo.id);
}

const starDialogVisible = ref(false);
const loading = ref(true)
const amInList = ref([])
const collections = ref([])
var changedCollection = []
function star(){
    starDialogVisible.value = true;
    loading.value = true
    changedCollection = []
    Collection.GetCollection().then(
        (res)=>{
            collections.value = res.data.package_list
            loading.value = false
        }
    )
}
function likeIt(){
    for(const cc of changedCollection){
        console.log(amInList.value,cc)
        if(amInList.value.find((col,idx,arr)=>{return col.package_id == cc.id})){
            Collection.CancelDocument(
                {
                    work_id_list:[props.paperInfo.id.substring(21)],
                    package_id: cc.id
                }
            ).then(
                (res)=>{
                    ElNotification({
                        title: "取消收藏成功",
                        message: "成功将"+props.paperInfo.display_name+"移出收藏夹",
                        type: "success",
                        duration: 1000
                    })
                    
                    loading.value = true
                    Collection.GetCollectionListByPaper(
                        {
                            "work_id":props.paperInfo.id.substring(21)
                        }
                    ).then(
                        (res)=>{
                            if(res.data.package_list){
                                amInList.value = res.data.package_list
                            }else{
                                amInList.value = []
                            }
                        }
                    )
                }
            )
        }else{
            Collection.AddDocument(
                {
                    work_id:props.paperInfo.id.substring(21),
                    package_id: cc.id
                }
            ).then(
                (res)=>{
                    ElNotification({
                    title: "收藏成功",
                    message: "成功将"+props.paperInfo.display_name+"加入收藏夹",
                    type: "success",
                    duration: 1000
                })
                
                loading.value = true
                Collection.GetCollectionListByPaper(
                    {
                        "work_id":props.paperInfo.id.substring(21)
                    }
                ).then(
                    (res)=>{
                        if(res.data.package_list){
                            amInList.value = res.data.package_list
                        }else{
                                amInList.value = []
                            }
                    }
                )
                }
            )
        }
    }
    
}

function starChanged(which){
    var i = -1
    if(i = changedCollection.find((col,idx,arr)=>{return col.id == which.id})){
        changedCollection.splice(i,1)
    }else{
        changedCollection.push(which)
    }
    
}


onMounted(
    ()=>{
        Collection.GetCollectionListByPaper(
            {
                "work_id":props.paperInfo.id.substring(21)
            }
        ).then(
            (res)=>{
                if(res.data.package_list){
                    amInList.value = res.data.package_list
                }else{
                    amInList.value = []
                }
            }
        )
    }
)


const bibtex = ref("");
const { copy, copied } = useClipboard({ bibtex })
const bibtexDialogVisible = ref(false);
const getBiBTeX = (paperInfo) => {
  // 需要的字段有
  // 文章的标题 work.display_name
  // 文章的作者 work.authorships 对其中每条 authorship.author.display_name
  // 文章的journal host_venue.display_name
  // 文章的出版年份 work.publication_year
  const { display_name, authorships, publication_year, host_venue } = paperInfo;
  const author = authorships.map((authorship) => {
    return authorship.author.display_name;
  });
  const journal = host_venue.display_name;
  bibtex.value = `@article{${display_name},
    author = {${author}},
    title = {${display_name}},
    journal = {${journal}},
    year = {${publication_year}},
  }`;
  console.log(bibtex.value);
  return bibtex.value;
};
</script>
<style>
.btn{
    border-radius:0px;
    background-color: #DBE9EF;
    transition: all 0.1s;
    border:0.5px white solid
}
.btn:hover{
  background-color: rgb(153, 194, 231);
  box-shadow: 0 0.3125rem 0.5rem rgb(75, 154, 207);
}
.card{
    border-radius:0px;
    box-shadow: 0 0.3125rem 0.5rem rgb(0 0 0 / 10%);
}

/* #region 对话框 */
.fade-enter-active,
.fade-leave-active{
  transition: all v-bind(closeDuration);
}
.fade-enter-from,
.fade-leave-to{
  opacity: 0;
}

.up-enter-active,
.up-leave-active{
  transition: all v-bind(closeDuration);
}

.up-enter-from,
.up-leave-to{
  opacity: 0;
  transform: translate3d(-50%, 100px, 0);
}

.dialog-container {
  width: 100vw;
  height: 100vh;
  /* background-color: rgb(24 24 27 / 0.8); */
  background-color: rgba(255, 255, 255, 0.6);
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
}
.dialog-window {
  width: 80%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  padding: 6px 8px;
  border-radius: 2px;
  border: 4px solid black;
  cursor: pointer;
  background-color: white;
}
@media (min-width: 1280px) {
  .dialog-window{
    width: 35%;
  } 
}
.dark.dialog-window {
  background-color: rgb(39 39 42);
  border-color: rgb(82 82 91);
}

.dialog-title {
  font-size: 22px;
  line-height: 26px;
  font-weight: 700;
  margin-bottom: 20px;
}
.dark.dialog-title {
  color: rgb(228 228 231);
}

.dialog-content {
  font-size: 16.8px;
  line-height: 20.8px;
  color: rgb(24 24 27);
  margin-bottom: 20px;
  font-weight: 500;
}
.dark.dialog-content {
  color: rgb(228 228 231);
}

.dialog-btn-wrapper {
  display: flex;
  justify-content: flex-end;
}

.dialog-confirm-btn {
  border: none;
  outline: none;
  display: inline-block;
  position: relative;
  z-index: 0;
  padding: 8px 35.2px;
  height: 38px;
  font-size: 16px;
  cursor: pointer;
  background: transparent;
  user-select: none;
  color: black;
  overflow: hidden;
}
.dialog-confirm-btn span {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: -1;
  border: 4px solid black;
}
.dialog-confirm-btn span::before {
  content: "";
  position: absolute;
  width: 8%;
  height: 500%;
  background: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-60deg);
  transition: all 0.3s;
}
.dialog-confirm-btn:hover span::before {
  transform: translate(-50%, -50%) rotate(-90deg);
  width: 100%;
  background: black;
}
.dialog-confirm-btn:hover {
  color: white;
}

.dialog-cancel-btn {
  border: none;
  display: inline-block;
  position: relative;
  z-index: 0;
  padding: 8px 35.2px;
  height: 38px;
  font-size: 16px;
  cursor: pointer;
  background: transparent;
  user-select: none;
  color: white;
  overflow: hidden;
}
.dialog-cancel-btn span {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: -1;
  border: 4px solid black;
}
.dialog-cancel-btn span::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 500%;
  background: black;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  transition: all 0.3s;
}
.dialog-cancel-btn:hover span::before {
  transform: translate(-50%, -50%) rotate(-60deg);
  width: 8%;
  background: white;
}
.dialog-cancel-btn:hover {
  color: black;
}
.el-checkbox__inner{
  background-color: #fff;
}
.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: black;
  border-color: black;
}
.el-checkbox__inner:hover {
  border-color: black;
}
.el-checkbox__input.is-checked+.el-checkbox__label {
  color: black;
  font-weight: bold;
}
.el-checkbox.is-bordered.is-checked {
  border-color:black;
}
</style>