<template>
    <div>
        <div class="toptitle">
            <svg style="margin: 0; padding: 0; width: 15; height: 15;">
                <rect width="10" height="14"
                style="fill:rgb(0,0,0);stroke-width:1;stroke:rgb(0,0,0)"/>
            </svg>
            <span>&nbsp;&nbsp;</span>
            <span>{{$t('header.UA')}}</span>
        </div>
        <!-- <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >Check all</el-checkbox
        > -->
        <!-- <el-checkbox-group
            v-model="checkedApplies"
            @change="handleCheckedAppliesChange"
            style="width: 100%; height: 100%; background: transpatrent"
        > -->
            <el-row style="
            background-color: rgb(247, 247, 247);
            border-radius: 3px;
            box-shadow: 2px 2px 2px 2px #dedede;
            padding-top: 3vh;
            padding-left: 3vw">
                <el-col
                v-for.sync="(o, index) in requestData.list.slice((pages.currentPage*9 - 9), (pages.currentPage*9))"
                :key="o"
                :span="7"
                :offset="(index%3) > 0 ? 1 : 0"
                >
                    <el-card :body-style="{ padding: '0px'}" style="margin-bottom: 2.5vh; min-width: 190px;">
                        <!-- <el-checkbox :key="o.user_id" label="" class="checkbox"></el-checkbox> -->
                        <div style="padding: 14px">
                            <span class="card_header">
                                <svg style="margin: 0; padding: 0; width: 7; height: 11;">
                                    <rect width="20" height="8"
                                    style="fill:rgb(0,0,0);stroke-width:1;stroke:rgb(0,0,0)"/>
                                </svg>
                                {{o.author_name}}
                            </span>
                            <div class="bottom">
                                    <span class="name">{{$t('header.institution')}}</span>
                                    <time class="time">{{ o.institution }}</time>
                            </div>
                            <div class="bottom">
                                <span class="name">pdf</span>
                                <a :href="o.url" target="_blank" class="time">{{$t('header.GlancePdf')}}</a>
                                <!-- <el-button text class="button">Operating</el-button> -->
                            </div>
                            <div class="bottom">
                                <span class="name">{{$t('header.UAApplyTime')}}</span>
                                <span class="time">{{ o.send_time }}</span>
                            </div>
                        </div>
                        <div class="bottomButton">
                            <el-button type="primary" style="margin-bottom: 0.2vh; height: 3vh; background-color: rgb(0,0,0); border-color: rgb(0,0,0); border-radius: 2px" @click="pass(o.id, pages.currentPage*9 - 9 + index)">{{$t('header.CAPass')}}</el-button>
                            <el-button type="info" plain style="margin-bottom: 0.2vh; height: 3vh;  border-radius: 2px" @click="refuse(o.id, pages.currentPage*9 - 9 + index)">{{$t('header.CARefuse')}}</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <div class="paginationBox">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-count="requestData.totalPage"
                    @current-change="pageCurrentChange"
                    class="pagination"
                ></el-pagination>
            </div>
        <!-- </el-checkbox-group> -->
    </div>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {Admin} from "../../api/admin";
const requestData = reactive({
    msg: "",
    list:[],
    dead:{
            "id": "W2613718673",
            "work_name": "",
            "user_id": 2,
            "author_id": "A2164292938",
            "pdf": "W2613718673lOBBux.pdf",
            "url": "https://pdf-1309504341.cos.ap-beijing.myqcloud.com/W2613718673lOBBux.pdf",
            "has_pdf": 0,
            "send_time": "2022-11-29T00:21:29.179",
            "last_user_id": null,
            "last_author_id": "",
            "last_pdf": "",
            "last_url": null,
            "last_has_pdf": -1,
            "last_send_time": null
        },
    totalApply: 0,
    totalPage: 0
});
const pages = reactive({
    currentPage : 1
})
const func1= () => {
    Admin.managerCheckUploadPdf({}).then((res)=>{
            requestData.list = res.data.upload_pdf_form_dic_list;
            console.log(requestData.list)
            requestData.list.push(requestData.dead);
            requestData.list.push(requestData.dead);
            requestData.list.push(requestData.dead);
            requestData.list.push(requestData.dead);
            requestData.list.push(requestData.dead);
            requestData.list.push(requestData.dead);
            requestData.list.push(requestData.dead);
            requestData.list.push(requestData.dead);
            requestData.list.push(requestData.dead);
            requestData.list.push(requestData.dead);
            requestData.list.push(requestData.dead);
            requestData.list.push(requestData.dead);
            requestData.list.push(requestData.dead);
            requestData.list.push(requestData.dead);
            requestData.totalApply = Object.keys(requestData.list).length;
            requestData.totalPage = Math.floor(requestData.totalApply / 9) + 1;
            for(let i = 0; i < Object.keys(requestData.list).length; i++){
                Admin.getSingleData({
                    "entity_type": "authors",
                    "params": {
                        "id": requestData.list[i].author_id
                    }
                }).then((res)=>{
                    console.log(res.data)
                    Object.assign(requestData.list[i], {"author_name": res.data.single_data.display_name});
                    Object.assign(requestData.list[i], {"institution": res.data.single_data.last_known_institution.display_name});
                });
            }
        });
}
func1();  //因为setup即相当于created:

function pageCurrentChange(val){
    pages.currentPage = val;
    console.log(pages.currentPage);
}

function pass(uid, num){
    console.log(num)
    Admin.managerDealUploadPdf({
        "work_id": uid,
        "deal_result": 1
    }).then((res)=>{
        requestData.list.splice(num, 1);
    });
}

function refuse(uid, num){
    Admin.managerDealUploadPdf({
        "work_id": uid,
        "deal_result": -1
    }).then((res)=>{
        requestData.list.splice(num, 1);
    });
}
</script>

<style>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  text-align: left;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}

.el-divider--horizontal{
     margin: 0.5vh 0 !important;
     background: 0 0 !important;
 }

.el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
    background-color: black !important;
    color: var(--el-color-white);
    font-weight: 700;
}

.el-pagination.is-background .el-pager li:not(.is-disabled):hover {
    color: rgb(139, 139, 139);
}
.el-pager li:focus-visible {
    outline: 1px solid black;
}
</style>

<style scoped>

.card_header {
    font-size: 1.3em !important;
    display: block;
    position: relative;
    left: 0;
    text-align: left;
    /* color: rgb(0, 125, 255); */
}

.top {
    margin-top: 1vh;
    margin-bottom: 3vh;
}

.bottomButton {
    margin-bottom: 1vh;
}

.checkbox {
    background-color: transparent;
    float: left;
    /* position: relative; */
}

.pagination {
    border-radius: 30px;
    padding-right: 3.5vw;
}
.paginationBox {
    display: flex;
    justify-content: center;
    align-items: center;
    height:8vh;
    padding-top: 8vh;
}

.toptitle {
    margin-top: 2vh;
    margin-bottom: 5vh;
    font-size: 1.7em;
    text-align: left;
    left: 0;
}

.name {
    text-align: left;
}
.time {
    display: inline-block;
    font-size: 12px;
    color: #999;
    float: right;
    width: 11vw;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: transparent;
}
</style>
