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
                v-for.sync="(o, index) in requestData.list.slice((pages.currentPage*9 - 9), (pages.currentPage*9))"
                :key="o"
                :span="7"
                :offset="(index%3) > 0 ? 1 : 0"
                >
                    <el-card :body-style="{ padding: '0px'}" style="margin-bottom: 1vh">
                        <!-- <el-checkbox :key="o.user_id" label="" class="checkbox"></el-checkbox> -->
                        <div style="padding: 14px">
                            <span class="card_header">{{o.author_name}}</span>
                            <div class="bottom">
                                    <span>{{$t('header.institution')}}</span>
                                    <time class="time">{{ o.institution }}</time>
                            </div>
                            <div class="bottom">
                                <span>pdf</span>
                                <a :href="o.url" target="_blank" class="time">{{$t('header.GlancePdf')}}</a>
                                <!-- <el-button text class="button">Operating</el-button> -->
                            </div>
                            <div class="bottom">
                                <span>{{$t('header.UAApplyTime')}}</span>
                                <span class="time">{{ o.send_time }}</span>
                            </div>
                        </div>
                        <div class="bottomButton">
                            <el-button type="primary" style="margin-bottom: 0.2vh; height: 3vh" @click="pass(o.id, pages.currentPage*9 - 9 + index)">{{$t('header.CAPass')}}</el-button>
                            <el-button type="info" plain style="margin-bottom: 0.2vh; height: 3vh" @click="refuse(o.id, pages.currentPage*9 - 9 + index)">{{$t('header.CARefuse')}}</el-button>
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
    Account.managerCheckUploadPdf({}).then((res)=>{
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
                Account.getSingleData({
                    "entity_type": "authors",
                    "params": {
                        "id": requestData.list[i].author_id
                    }
                }).then((res)=>{
                    console.log(res.data)
                    Object.assign(requestData.list[0], {"author_name": res.data.single_data.display_name});
                    Object.assign(requestData.list[0], {"institution": res.data.single_data.last_known_institution.display_name});
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
    Account.managerDealUploadPdf({
        "work_id": uid,
        "deal_result": 1
    }).then((res)=>{
        requestData.list.splice(num, 1);
    });
}

function refuse(uid, num){
    Account.managerDealUploadPdf({
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
