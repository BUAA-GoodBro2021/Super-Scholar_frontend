<template>
    <div class="name_card">
      <div class="card_body">
          <div style="vertical-align: middle;float:left">
            <div :class="'cover_wrap hidden-lg-and-down g'+random">
              <div class="cover_title" :style="{fontSize:coverTitleSize}">
                {{journalInfo.display_name}}
              </div>
            </div>
          </div>
          <div
            style="width: 40%; height: 100%; float:left"
            class="title-profile-li"
          >
            <div class="title_profile">
              <div class="title-profile-block">
                <span class="name">
                  <div class="institution-display-name">
                    {{ journalInfo.display_name }}
                  </div>
                </span>
                <div
                  v-if="journalInfo.homepage_url"
                  class="organization canClick"
                >
                  <el-icon>
                    <Notification />
                  </el-icon>
                  &nbsp;
                  <span @click="gotoHomePage">
                    主页地址：{{ journalInfo.homepage_url }}
                  </span>
                </div>
                <div class="organization">
                  总论文数：{{ journalInfo.works_count }}
                </div>
                <div class="organization">
                  期刊总被引数：{{ journalInfo.cited_by_count }}
                </div>
                <div v-if="journalInfo.apc_usd" class="organization">
                    期刊版面费：{{ journalInfo.apc_usd }} (美元)
                </div>
                <div class="concept">
                  <div class="card-concepts clearfix">
                        <div
                        class="card-concepts-wrap canClick"
                        v-for="(concept, conceptIndex) in journalInfo.x_concepts.slice(0, 11)"
                        @click="gotoConcept(concept)"
                    >
                        <div class="card-concept-context">
                        {{ concept.display_name }}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div id="chart" class="chart" style="float:left">

            </div>
          </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { useRouter } from "vue-router";
import * as echarts from 'echarts';
import 'element-plus/theme-chalk/display.css'
  const router = useRouter();
  const props = defineProps({
    journalInfo: Object,
  });
  const coverTitleSize=ref("20px")
  const random = ref(-1)
  function rnd( seed ){
    seed = ( seed * 9301 + 49297 ) % 233280; //为何使用这三个数?
    return seed / ( 233280.0 );
};
onMounted(
  ()=>{
    var sum = 0
    for(const c of props.journalInfo.display_name){
      sum+=c.charCodeAt();
    }
    console.log(sum)
    random.value = parseInt(rnd(sum)*10-0.001);
    nextTick(
      ()=>{
        var chart = echarts.init(document.getElementById('chart'))
    var xSeries = []
    var yWorkSeries = []
    var yCiteSeries = []
    for(var item of props.journalInfo.counts_by_year){
        xSeries.push(item.year)
        yWorkSeries.push(item.works_count)
        yCiteSeries.push(item.cited_by_count)
    }
    chart.setOption(
        {
            // title:{
            //     text:"论文被引量逐年变化"
            // },
            tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'cross' }
            },
            legend: {},
            xAxis:{
                data:xSeries
            },
            yAxis:[
              {
                type:'value',
                name:'文献数量',
                position:'left'
              },
              {
                type:'value',
                name:'总被引量',
                position:'right'
              }
            ],
            series:[
                {
                    type:'bar',
                    name:"文献数量",
                    yAxisIndex:0,
                    data:yWorkSeries
                },
                {
                    type:'bar',
                    name:"总被引量",
                    yAxisIndex:1,
                    data:yCiteSeries
                },
            ]
        }
    )
    window.onresize=function(){
      chart.resize()
    }    
  }
    )
    nextTick(
    ()=>{
      if(props.journalInfo.display_name.length<6){
        coverTitleSize.value = "40px"
      }else if(props.journalInfo.display_name.length<16){
        coverTitleSize.value = "28px"
      }
    }
  )
  }
)


  const gotoHomePage = () => {
    window.open(props.institutionInfo.homepage_url);
  };
  
  const gotoConcept = (concept) => {
    let { href } = router.resolve({
      name: "ConceptDetail",
      params: {
        tokenid: concept.id.substring(21),
      },
    });
    window.open(href, "_blank");
  };
  </script>
  
  <style scoped>
  .g0{
    background-image: linear-gradient(to right , #7A88FF, #7AFFAF);
  }
  .g1{
    background-image: linear-gradient(blue, pink);
  }
  .g2{
    background-image: linear-gradient(to top, black, 20%, cyan);
  }
  .g3{
    background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
  }
  .g4{
    background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
  }
  .g5{
    background-image: linear-gradient(120deg, #f093fb 0%, #f5576c 100%);
  }
  .g6{
    background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  }
  .g7{
    background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
  }
  .g8{
    background-image: linear-gradient(to top, #30cfd0 0%, #330867 100%);
  }
  .g9{
    background-image: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
  }
  .cover_wrap {
    height: 200px;
    width: 150px;
    border:1px solid;
    box-shadow: 3px 3px 3px 3px #dedede;
    
    display:inline-block;
    margin-left:-150px;
    vertical-align: middle;
  }
  .cover_title{
    background-color: rgba(64,64,64,0.4);
    margin-top:100%;
    height:25%;
    word-wrap: break-word;
    word-break:break-all;
    white-space: normal;
    color: white;
  }
  .chart{
    height:300px;
    width:40%;
  }
  .name_card {
    padding-top:40px;
    width: 100%;
    background-color: white;
    box-shadow: 3px 3px 3px 3px #dedede;
    height: 100%;
    font-family: "Times New Roman", Times, "Microsoft YaHei", serif;
  
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .card_body {
    height: 100%;
    width: 90%;
  }
  
  .card_body ul {
    margin: 0;
    height: 100%;
  }
  
  .card_body li {
    list-style: none;
    margin-right: 20px;
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
  
  .name {
    font-size: 30px;
    height: 40%;
    line-height: 100%;
    text-align: left;
  }
  
  .institution-display-name {
    margin: 1% 0%;
  }
  
  .title_profile {
    font-size: 23px;
    height: 55%;
    line-height: 100%;
    text-align: left;
    display: block;
  }
  
  .title-profile-block {
    display: block;
    height: 60%;
  }
  
  .title-profile-li {
    padding-left: 3rem;
    min-width: 60%;
  }
  
  .organization {
    font-size: 15px;
    height: 30%;
    margin-bottom: 10px;
    line-height: 100%;
    text-align: left;
    display: flex;
    align-items: center;
  }
  
  .canClick {
    cursor: pointer;
  }
  
  .canClick:hover {
    color: rgb(162, 143, 42);
  }
  
  .concept {
    font-size: 15px;
    color: rgb(162, 143, 42);
    /* height: 63%; */
    height: 73%;
    width: 100%;
    line-height: 20px;
    /* line-height: 50%; */
    text-align: left;
    display: flex;
    /* align-items: center; */
    /* display: block; */
    word-break: break-all;
    word-wrap: break-word;
  }
  
  .card-concepts {
    height: auto;
    margin-bottom: 0.8rem;
  }
  .card-concepts .card-concepts-wrap {
    float: left;
    margin-right: 10px;
    margin-bottom: 5px;
    padding: 3px 5px;
    box-sizing: border-box;
    border: 1.6px solid rgb(162, 143, 42);
    border-radius: 14px;
    font-size: 14px;
  }
  .card-concepts .card-concepts-wrap i {
    display: inline-block;
    margin-right: 3px;
  }
  .card-concepts .card-concepts-wrap .card-concept-context {
    display: inline-block;
    text-transform: capitalize;
  }
  .clearfix::before,
  .clearfix::after {
    content: "";
    display: table;
    clear: both;
  }
  </style>
  