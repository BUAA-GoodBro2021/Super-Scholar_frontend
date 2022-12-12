<template>
    
    <div class="paper-list-wrap" v-loading="loading">
        <div style="padding:10px;margin-left:100px">
            按照 
            <el-select style="margin:10px" @change="sortChange"  v-model="sortBy">
                <el-option
                 key="publication_date"
                 label="发表日期"
                 value="publication_date"
                />
                <el-option
                 key="cited_by_count"
                 label="被引次数"
                 value="cited_by_count"
                />
            </el-select>

            <el-radio-group v-model="sortSeq" @change="sortChange" style="margin:10px">
                <el-radio key="asc" label="asc" value="asc">升序</el-radio>
                <el-radio key="desc" label="desc" value="desc">降序</el-radio>
            </el-radio-group> 

            排序 
            
        </div>
        <ul>
            <!-- 单个搜索结果卡片 -->
            <li class="result-item" v-for="(item, index) in paperList">
                <WorksResCard class="left" :item="item" />
                <div class="right" :id="'paperChart'+index"></div>
            </li>

        </ul>
        <div class="pagination-wrap">
            <el-pagination
              layout="prev, pager, next"
              :page-size="5"
              @current-change="pageChange"
              hide-on-single-page
              :total="total" 
              :current-page="page"
            />
          </div>
      
    </div>
  </template>
<script setup>
import { nextTick } from "vue-demi";
import { Search } from "../../api/search";
import * as echarts from 'echarts';

import WorksResCard from "../../views/search/WorksResCard.vue";
const props = defineProps({
    filter: Object,
})

const paperList = ref()
const loading = ref(true)
const page = ref(1)
const total = ref(1)
const sortBy = ref("cited_by_count")
const sortSeq = ref("desc")
const { proxy, ctx } = getCurrentInstance()
const _this = ctx
emit:[
    "IKnowTotal"
]
const paperCharts = []


function updateData(){
    for(var paperChart of paperCharts){
        paperChart.dispose()
    }
    loading.value = true
    const req = {
            "entity_type": "works",
            "params": {
                filter: props.filter,
                page: page.value,
                per_page: 5,
                sort:{
                    
                }
            }
        }
    
    req.params.sort[sortBy.value] = sortSeq.value
    
    Search.getSearchDataList(
        req
    ).then((res)=>{
        paperList.value = res.data.list_of_data[0].results
        loading.value = false
        total.value = res.data.list_of_data[0].meta.count
        _this.$emit("IKnowTotal",total.value)
        nextTick(
        ()=>{
            var chartDom;
            var index = 0;
            while(chartDom = document.getElementById('paperChart'+(index))){
                var chart = echarts.init(chartDom)
                var xSeries = []
                var ySeries = []
                
                for(var item of paperList.value[index].counts_by_year){
                    xSeries.push(item.year)
                    ySeries.push(item.cited_by_count)
                }
                chart.setOption(
                    {
                        title:{
                            text:"论文被引量逐年变化"
                        },
                        xAxis:{
                            data:xSeries
                        },
                        yAxis:{},
                        series:[
                            {
                                type:'line',
                                data:ySeries
                            }
                        ]
                    }
                )
                paperCharts.push(chart)
                index++;
            }
        }
    )
    })

    
}

onMounted(() => {
    updateData()  
})
function pageChange(a){
    page.value = a
    updateData()
}
function sortChange(){
    page.value=1;
    updateData()
}
window.onresize = function(){
    for(var echart of paperCharts){
        echart.resize()
    }
}
</script>
<style scoped>

.paper-list-wrap {
    width: 100%;
    position: relative;
  }
  
  .pagination-wrap {
    margin-top: 5%;
    bottom: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 36px;
  }
  
  .search-result__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .result-item {
    width: 100%;
    display: flex;
    font-size: 0.875rem;
    float:left;
  }
  .left {
    width: 68%;
    margin-right: 2%;
  }
  
  .right {
    width: 30%;
    margin-bottom:30px;
    margin-top:30px;
  }
  
  @media (max-width: 1200px) {
  
    .left {
      width: 100%;
      margin: 10px 0 10px 0;
    }
  
    .right {
      width: 100%;
    }
  }
</style>