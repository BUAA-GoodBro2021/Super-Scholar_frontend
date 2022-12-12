<template>
    <div>
        <div class="top">
            <svg style="margin: 0; padding: 0; width: 15; height: 15;">
                <rect width="10" height="14"
                style="fill:rgb(0,0,0);stroke-width:1;stroke:rgb(0,0,0)"/>
            </svg>
            <span>&nbsp;&nbsp;</span>
            <span>{{$t('header.SSTitle1')}}</span>
            <span style="color: rgb(130, 130, 130)">{{requestData.totalUser}}</span>
            <span>{{$t('header.SSTitle2')}}</span>
        </div>
        <!-- <el-row style="
        background-color: rgb(247, 247, 247);
        border-radius: 3px;
        box-shadow: 2px 2px 2px 2px #dedede;
        padding-top: 3vh;
        padding-left: 3vw"> -->
        <el-row>
            <el-col
            v-for.sync="(o, index) in requestData.user.slice((pages.currentPage*9 - 9), (pages.currentPage*9))"
            :key="o"
            :span="7"
            :offset="(index%3) > 0 ? 1 : 0"
            >
                <el-card :body-style="{ padding: '0px'}" style="margin-bottom: 3vh; min-width: 220px;" class="card">
                    <!-- <el-checkbox :key="o.user_id" label="" class="checkbox"></el-checkbox> -->
                    <div style="padding: 14px">
                        <span class="card_header">
                            <svg style="margin: 0; padding: 0; width: 7; height: 11;">
                                <rect width="20" height="8"
                                style="fill:rgb(0,0,0);stroke-width:1;stroke:rgb(0,0,0)"/>
                            </svg>
                            {{o.username}}
                        </span>
                        <div class="bottom">
                                <span class="name">{{$t('header.SSEmail')}}</span>
                                <time class="time">{{ o.email }}</time>
                        </div>
                        <div class="bottom">
                            <span class="name">{{$t('header.institution')}}</span>
                            <el-button text class="button-opr" @click="clearInstitution(o)">{{$t('header.clearInstitution')}}</el-button>
                            <span class="mid">{{o.institution}}</span>
                        </div>
                        <div class="bottom">
                            <span class="name">{{$t('header.SSCreatedTime')}}</span>
                            <span class="time">{{ o.created_time }}</span>
                        </div>
                        <div class="bottom">
                            <span class="name">{{$t('header.SSPassageNum')}}</span>
                            <span class="time">{{ o.work_count }}</span>
                        </div>
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
    </div>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {Admin} from "../../api/admin";
const requestData = reactive({
    user:[],
    totalUser: 0,
    totalPage: 1,
    dead: {
        "user_id": 12,
        "username": "Harbour",
        "email": "2358272468@qq.com",
        "avatar_url": "https://random-avatar-1309504341.cos.ap-beijing.myqcloud.com/4.png",
        "is_active": true,
        "is_super": false,
        "is_professional": 1,
        "real_name": "Robin Harbour",
        "institution": "Healthcare Improvement Scotland",
        "institution_id": "I2800656170",
        "work_count": 27,
        "open_alex_id": "A2023911777",
        "created_time": "2022-11-29T11:15:09.518",
        "updated_time": "2022-12-05T01:04:12.994",
        "unread_message_count": 0
    }
});
const pages = reactive({
    currentPage: 1
})
const func1= () => {
    Admin.managerGetAllUser({}).then((res)=>{
        for(let i = 0; i < Object.keys(res.data.user_list).length; i = i + 1){
            if(res.data.user_list[i].is_professional == 1){
                requestData.totalUser += 1;
                requestData.user.push(res.data.user_list[i]);
            }
        }
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.user.push(requestData.dead)
        requestData.totalPage = Math.floor(requestData.totalUser / 9) + 1;
    });
}
func1();  //因为setup即相当于created:

function pageCurrentChange(val){
    pages.currentPage = val;
}

function clearInstitution(o){
     Admin.managerDeleteUserAuthor({
         "user_id": o.user_id
     }).then((res)=>{
         console.log("over")
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
  height: 10px !important;
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
    background-color: white !important;
    color: black;
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
    margin-top: 2vh;
    margin-bottom: 5vh;
    font-size: 1.7em;
    text-align: left;
    left: 0;
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
    padding-top: 8.5vh;
}

.button-opr {
  padding: 0;
}

.el-button {
    height: 12px !important;
}

.name {
    text-align: left;
}
.time {
    display: inline-block;
    font-size: 12px;
    color: #999;
    float: right;
    width: 10vw;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: transparent;
}

.mid{
    display: inline-block;
    font-size: 12px;
    color: #999;
    float: right;
    width: 10vw;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: transparent;
}
.button-opr{
    display: inline-block;
    font-size: 12px;
    color: #999;
    float: right;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: transparent;
}

.card {
    /* background: linear-gradient(70deg, rgb(221, 245, 255),rgb(255, 234, 237)); */
    background-color: rgba(255, 255, 255, 0.11);
    border-color: white;
    box-shadow: rgb(199, 199, 199);
}

::v-deep .el-button--primary{
    background-color: rgba(151, 217, 255, 0.932) !important;
    border-color: rgb(255,255,255);
}

::v-deep .el-button--primary:active, .el-button--primary:hover{
    background-color: rgba(125, 200, 230, 0.911) !important;
}
</style>
