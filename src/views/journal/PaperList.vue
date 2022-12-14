<template>
    
    <div class="paper-list-wrap" v-loading="loading">
        <div style="margin-left:100px">
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
        <div class="hint" v-if="total > 10000">
            *由于结果数量超过10,000，出于实用性考虑，列表只会展示相关度排序的前10,000条
        </div>
        <ul>
            <!-- 单个搜索结果卡片 -->
            <li class="result-item" v-for="(item, index) in paperList">
                <div class="left">
                    <WorksResCard :item="item" />
                </div>
                <div class="right" :id="'paperChart'+index"></div>
            </li>

        </ul>
        <div class="pagination-wrap">
            <el-pagination
              layout="prev, pager, next"
              :page-size="5"
              @current-change="pageChange"
              hide-on-single-page
              :total="total <= 10000 ? total : 10000" 
              :current-page="page"
            />
          </div>
      
    </div>
  </template>
<script setup>
import { Search } from "../../api/search";
import * as echarts from 'echarts';

import WorksResCard from "../../views/search/WorksResCard.vue";
const props = defineProps({
    filter: Object,
})
const colors = ['#d7ab82', '#919e8b', '#919e8b'];
const paperList = ref()
const loading = ref(true)
const page = ref(1)
const total = ref(1)
const sortBy = ref("cited_by_count")
const sortSeq = ref("desc")
const { proxy, ctx } = getCurrentInstance()
const _this = ctx
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
        if(total.value>10000)
            total.value = 10000
        nextTick(
        ()=>{
            var chartDom;
            var index = 0;
            while(chartDom = document.getElementById('paperChart'+(index))){
                var chart = echarts.init(chartDom)
                var xSeries = []
                var ySeries = []
                var tmpCount = []
                tmpCount.push(...paperList.value[index].counts_by_year)
                tmpCount.sort((a,b)=>a.year-b.year)
                for(var item of tmpCount){
                    xSeries.push(item.year)
                    ySeries.push(item.cited_by_count)
                }
                chart.setOption(
                    {
                        color:colors,
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
    background-color: #fff;
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
    margin-bottom: 10px;

  }
  .left {
    background-color: white;
    width: 60%;
    margin-right: 2%;
  }
  
  .right {
    width: 38%;
    margin-bottom:30px;
    margin-top:30px;
  }
  

.hint {
  margin: 20px;
  font-style: italic;
}
</style>