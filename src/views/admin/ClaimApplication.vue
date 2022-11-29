<template>
    <div>
        <div class="top">
            <el-button type="primary" plain>{{$t('header.CAAllPass')}}</el-button>
            <el-button type="info" plain>{{$t('header.CARefuseAll')}}</el-button>
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
            <el-row>
                <el-col
                v-for.sync="(o, index) in requestData.list.slice((pages.currentPage*6 - 6), (pages.currentPage*6))"
                :key="o"
                :span="7"
                :offset="(index%3) > 0 ? 1 : 0"
                >
                    <el-card :body-style="{ padding: '0px'}" style="margin-bottom: 1vh">
                        <!-- <el-checkbox :key="o.user_id" label="" class="checkbox"></el-checkbox> -->
                        <div style="padding: 14px">
                            <span class="card_header">{{o.real_name}}</span>
                            <div class="bottom">
                                    <span>{{$t('header.claimTime')}}</span>
                                    <time class="time">{{ o.claim_time }}</time>
                            </div>
                            <div class="bottom">
                                <span>{{$t('header.institution')}}</span>
                                <span class="time">{{o.institution}}</span>
                                <!-- <el-button text class="button">Operating</el-button> -->
                            </div>
                            <div class="bottom">
                                <span>{{$t('header.claimReason')}}</span>
                                <span class="time">{{ o.content }}</span>
                            </div>
                        </div>
                        <el-divider content-position="right"><el-icon><star-filled /></el-icon></el-divider>
                        <div style="padding: 14px">
                            <span class="card_header">{{ o.author_name }}</span>
                            <div class="bottom">
                                    <span>{{$t('header.worksCount')}}</span>
                                    <span class="time">{{ o.works_count }}</span>
                            </div>
                            <div class="bottom">
                                <span>{{$t('header.institution')}}</span>
                                <span class="time">{{o.institution}}</span>
                                <!-- <el-button text class="button">Operating</el-button> -->
                            </div>
                            <div class="bottom">
                                <span>{{$t('header.authorUrl')}}</span>
                                <a class="time" :href="o.author_url" target="_blank">{{ o.author_url }}</a>
                            </div>
                        </div>
                        <div class="bottomButton">
                            <el-button type="primary" style="margin-bottom: 0.2vh; height: 3vh" @click="pass(o.user_id, pages.currentPage*6 - 6 + index)">{{$t('header.CAPass')}}</el-button>
                            <el-button type="info" plain style="margin-bottom: 0.2vh; height: 3vh" @click="refuse(o.user_id, pages.currentPage*6 - 6 + index)">{{$t('header.CARefuse')}}</el-button>
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
import {Account} from "../../api/account";
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
            "claim_time": "2022-11-27T18:34:43.310"
        },
    totalApply: 0,
    totalPage: 0
});

const pages = reactive({
    currentPage : 1
})
const func1= () => {
    Account.checkClaim({}).then((res)=>{
            requestData.list = res.data.form_handling_dic_list;
            requestData.totalApply = Object.keys(requestData.list).length;
            requestData.totalPage = Math.floor(requestData.totalApply / 6) + 1;
            for(let i = 0; i<Object.keys(requestData.list).length; i = i + 1){
                Account.getSingleData({
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
    Account.dealApply({
        "user_id": uid,
        "deal_result": 1
    }).then((res)=>{
        requestData.list.splice(num, 1);
    });
}

function refuse(uid, num){
    Account.dealApply({
        "user_id": uid,
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
    height:10vh;
}
</style>
