<template>
    <div>
        <div class="top">
            <span>&nbsp;&nbsp;</span>
            <span>{{$t('header.SSTitle1')}}</span>
            <span style="color: rgb(64, 158, 255)">{{requestData.totalUser}}</span>
            <span>{{$t('header.SSTitle2')}}</span>
        </div>
        <el-row>
            <el-col
            v-for.sync="(o, index) in requestData.user.slice((pages.currentPage*12 - 12), (pages.currentPage*12))"
            :key="o"
            :span="7"
            :offset="(index%3) > 0 ? 1 : 0"
            >
                <el-card :body-style="{ padding: '0px'}" style="margin-bottom: 1.7vh">
                    <!-- <el-checkbox :key="o.user_id" label="" class="checkbox"></el-checkbox> -->
                    <div style="padding: 14px">
                        <span class="card_header">{{o.username}}</span>
                        <div class="bottom">
                                <span>{{$t('header.SSEmail')}}</span>
                                <time class="time">{{ o.email }}</time>
                        </div>
                        <div class="bottom">
                            <span>{{$t('header.institution')}}</span>
                            <span class="time">{{o.institution}}</span>
                            <!-- <el-button text class="button">Operating</el-button> -->
                        </div>
                        <div class="bottom">
                            <span>{{$t('header.SSCreatedTime')}}</span>
                            <span class="time">{{ o.created_time }}</span>
                        </div>
                        <div class="bottom">
                            <span>{{$t('header.SSPassageNum')}}</span>
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
import {Account} from "../../api/account";
const requestData = reactive({
    user:[],
    totalUser: 0,
    totalPage: 1
});
const pages = reactive({
    currentPage: 1
})
const func1= () => {
    Account.managerGetAllUser({}).then((res)=>{
        for(let i = 0; i < Object.keys(res.data.user_list).length; i = i + 1){
            if(res.data.user_list[i].is_professional == 1){
                requestData.totalUser += 1;
                requestData.user.push(res.data.user_list[i]);
            }
        }
        requestData.totalPage = Math.floor(requestData.totalUser / 12) + 1;
    });
}
func1();  //因为setup即相当于created:

function pageCurrentChange(val){
    pages.currentPage = val;
}
</script>

<style>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>

<style scoped>
.card_header {
    font-size: 1.3em !important;
}

.top {
    margin-top: 1vh;
    margin-bottom: 2.5vh;
    font-size: 1.5em;
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
    height:5vh;
}
</style>
