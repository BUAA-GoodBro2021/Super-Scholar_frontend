<template>
    <div>
        <div class="toptitle">
            <svg style="margin: 0; padding: 0; width: 15; height: 15;">
                <rect width="10" height="14"
                style="fill:rgb(255,255,255);stroke-width:1;stroke:rgb(255,255,255)"/>
            </svg>
            <span>&nbsp;&nbsp;</span>
            <span style="color: rgb(255,255,255)">{{$t('header.CA')}}</span>
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
            <!-- <el-row style="
            background-color: rgb(247, 247, 247);
            border-radius: 3px;
            box-shadow: 2px 2px 2px 2px #dedede;
            padding-top: 3vh;
            padding-left: 3vw"> -->
            <el-row v-if="requestData.totalApply">
                <el-col
                v-for.sync="(o, index) in requestData.list.slice((pages.currentPage*6 - 6), (pages.currentPage*6))"
                :key="o"
                :span="7"
                :offset="(index%3) > 0 ? 1 : 0"
                >
                    <el-card :body-style="{ padding: '0px'}" style="margin-bottom: 2.5vh; height: 34vh; min-width: 180px" class="card">
                        <!-- <el-checkbox :key="o.user_id" label="" class="checkbox"></el-checkbox> -->
                        <div style="padding: 14px; height: 17vh;">
                            <span class="card_header">
                                <svg style="margin: 0; padding: 0; width: 7; height: 11;">
                                    <rect width="20" height="8"
                                    style="fill:rgb(0,0,0);stroke-width:1;stroke:rgb(0,0,0)"/>
                                </svg>
                                {{o.username}} - {{ o.author_name }}
                            </span>
                            <div class="bottom">
                                    <span class="name">{{$t('header.claimTime')}}</span>
                                    <time class="time">{{ o.claim_time }}</time>
                            </div>
                            <div class="bottom">
                                <span class="name">{{$t('header.institution')}}</span>
                                <span class="time">{{o.institution}}</span>
                                <!-- <el-button text class="button">Operating</el-button> -->
                            </div>
                            <div class="bottom">
                                <span class="name">{{$t('header.claimReason')}}</span>
                                <span class="time">{{ o.content }}</span>
                            </div>
                        </div>
                        <!-- <el-divider content-position="right"><el-icon><star-filled /></el-icon></el-divider> -->
                        <!-- <el-divider content-position="right">
                            <svg width="10" height="10">
                                <polygon points="5,0 8,10 0.5,4 9.5,4 2,10" style="fill:rgb(0,0,0);stroke:rgb(0,0,0);stroke-width:1;"/>
                            </svg>
                        </el-divider> -->
                        <el-divider></el-divider>
                        <div style="padding: 14px; padding-top: 0px; padding-bottom: 0px; height: 10vh;">
                            <!-- <span class="card_header">{{ o.author_name }}</span> -->
                            <div class="bottom">
                                    <span class="name">{{$t('header.worksCount')}}</span>
                                    <span class="time">{{ o.works_count }}</span>
                            </div>
                            <div class="bottom">
                                <span class="name">{{$t('header.institution')}}</span>
                                <span class="time">{{o.institution}}</span>
                                <!-- <el-button text class="button">Operating</el-button> -->
                            </div>
                            <div class="bottom">
                                <span class="name">{{$t('header.authorUrl')}}</span>
                                <a class="time" :href="o.author_url" target="_blank">{{ o.author_url }}</a>
                            </div>
                        </div>
                        <div class="bottomButton">
                            <el-button type="primary" style="margin-bottom: 0.2vh; height: 3vh; border-radius: 2px" @click="pass(o.user_id, pages.currentPage*6 - 6 + index)">{{$t('header.CAPass')}}</el-button>
                            <el-button type="info" plain style="margin-bottom: 0.2vh; height: 3vh;  border-radius: 2px" @click="refuse(o.user_id, pages.currentPage*6 - 6 + index)">{{$t('header.CARefuse')}}</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <div class="paginationBox" v-if="requestData.totalApply">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-count="requestData.totalPage"
                    @current-change="pageCurrentChange"
                    class="pagination"
                ></el-pagination>
            </div>
            <div v-if="requestData.totalApply == 0" style="color: white; font-size: 1.3em; height: 100%;">
                <ElEmpty description="暂无申请"/>
            </div>
        <!-- </el-checkbox-group> -->
    </div>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {Admin} from "../../api/admin";
import { ElEmpty } from "element-plus";
const requestData = reactive({
    msg: "",
    list:[],
    dead:{
            "user_id": 2,
            "content": "姐姐~",
            "author_id": "A2164292938",
            "institution": "二次元",
            "real_name": "ajk",
            "is_pass": 0,
            "claim_time": "2022-11-27T18:34:43.310",
            "username": "Siri"
        },
    totalApply: 0,
    totalPage: 0
});

const pages = reactive({
    currentPage : 1
})
const func1= () => {
    Admin.checkClaim({}).then((res)=>{
            requestData.list = res.data.form_handling_dic_list;
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            // requestData.list.push(requestData.dead);
            requestData.totalApply = Object.keys(requestData.list).length;
            requestData.totalPage = Math.floor(requestData.totalApply / 6) + 1;
            for(let i = 0; i<Object.keys(requestData.list).length; i = i + 1){
                Admin.getSingleData({
                    "entity_type": "authors",
                    "params": {
                        "id": res.data.form_handling_dic_list[i].author_id
                    }
                }).then((res)=>{
                    console.log("i",i);
                    Object.assign(requestData.list[i], {"author_name": res.data.single_data.display_name});
                    Object.assign(requestData.list[i], {"works_count": res.data.single_data.works_count});
                    Object.assign(requestData.list[i], {"institution": res.data.single_data.last_known_institution.display_name});
                    Object.assign(requestData.list[i], {"author_url": res.data.single_data.id});
                    console.log(requestData.list);
                });
            }
        });
}
func1();  //因为setup即相当于created:

function pageCurrentChange(val){
    pages.currentPage = val;
}

function pass(uid, num){
    Admin.dealApply({
        "user_id": uid,
        "deal_result": 1
    }).then((res)=>{
        requestData.list.splice(num, 1);
    });
}

function refuse(uid, num){
    Admin.dealApply({
        "user_id": uid,
        "deal_result": -1
    }).then((res)=>{
        requestData.list.splice(num, 1);
    });
}
</script>

<style>

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
  color: rgb(153, 228, 255);
}

.el-divider--horizontal{
     margin: 0.5vh 0 !important;
     background: 0 0 !important;
 }

.el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
    background-color: rgb(85, 85, 85) !important;
    color: white;
    font-weight: 700;
}

.el-pagination.is-background .el-pager li:not(.is-disabled):hover {
    color: rgb(139, 139, 139);
}
.el-pager li:focus-visible {
    outline: 1px solid rgb(231, 247, 253);
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
    margin-top: 1.5vh;
    margin-bottom: 4vh;
}

.bottomButton {
    margin-bottom: 0vh;
    height: 2vh;
}

.checkbox {
    background-color: transparent;
    float: left;
    /* position: relative; */
}

.pagination {
    border-radius: 30px;
    padding-right: 3.5vw;
    margin-top: 3vh;
}
.paginationBox {
    display: flex;
    justify-content: center;
    align-items: center;
    height:8vh;
}

.name {
    text-align: left;
}
.time {
    display: inline-block;
    font-size: 12px;
    color: rgb(214, 214, 214);
    float: right;
    width: 11vw;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: transparent;
    z-index: auto;
}

.toptitle {
    margin-top: 2vh;
    margin-bottom: 5vh;
    font-size: 1.7em;
    text-align: left;
    left: 0;
}

.card {
    /* background: linear-gradient(70deg, rgb(221, 245, 255),rgb(255, 234, 237)); */
    background-color: rgba(255, 255, 255, 0.55);
    border-color: white;
    box-shadow: rgb(199, 199, 199);
}

::v-deep .el-button--primary{
    background-color: rgb(0, 27, 37) !important;
    border-color: rgb(138, 138, 138);
}

::v-deep .el-button--primary:active, .el-button--primary:hover{
    background-color: rgb(255, 255, 255) !important;
    color: black;
}

</style>
