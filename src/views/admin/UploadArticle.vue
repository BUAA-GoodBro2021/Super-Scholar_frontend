<template>
    <div>
        <div>
            <el-button type="primary" plain>{{$t('header.CAAllPass')}}</el-button>
            <el-button type="info" plain>{{$t('header.CARefuseAll')}}</el-button>
        </div>
        <el-row>
            <el-col
            v-for="(o, index) in 2"
            :key="o"
            :span="8"
            :offset="index > 0 ? 2 : 0"
            >
                <el-card :body-style="{ padding: '0px' }">
                    <!-- <img
                        src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                        class="image"
                    /> -->
                    <div style="padding: 14px">
                        <span>Yummy hamburger</span>
                        <div class="bottom">
                        <time class="time">{{ currentDate }}</time>
                        <el-button text class="button">Operating</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {Account} from "../../api/account";
const currentDate = ref(new Date())
const requestData = reactive({
    msg: "",
    author_list:[],
    list:[]
});
var i = 0;
const func1= () => {
    Account.checkClaim({}).then((res)=>{
            alert('请求成功!3');
            console.log(res.data.form_handling_dic_list);
            for(i; i<Object.keys(res.data.form_handling_dic_list).length; i++){
                console.log("i", res.data.form_handling_dic_list[i])
                Account.getSingleData({
                    entity_type: "authors",
                    params: {
                        id: res.data.form_handling_dic_list[i].author_id,
                    }
                }).then((res)=>{
                    console.log("author")
                    console.log(res)
                });
            }
        });
}
func1();  //因为setup即相当于created:

</script>

<style>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
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
</style>
