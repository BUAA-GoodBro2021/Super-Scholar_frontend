<template>
        <el-tabs v-model="activeName" @tab-change="chartResize"  class="demo-tabs">
            <el-tab-pane :label="'参考文献 '+ citingTotal" name="citing" class="tab-pane">
                <PaperListVue :total="citingTotal" :filter="{cited_by: paperId}" @IKnowTotal="recvTotalCiting"/>
            </el-tab-pane>
            <el-tab-pane :label="'引证文献 ' + citedTotal" name="citedBy" class="tab-pane">
                <div style="width:100%">
                    <div id="citeChart" style="width: 100%;height: 400px"></div>
                </div>
                <PaperListVue  :filter="{cites: paperId}"  @IKnowTotal="recvTotalCited"/>
            </el-tab-pane>
            <el-tab-pane label="评论" name="comments" class="tab-pane">
                <PaperCommentVue :workName="paperInfo.display_name" :paperId="paperId" style="width:100%"></PaperCommentVue>
            </el-tab-pane>
        </el-tabs>
</template>
<script setup>
import PaperListVue from './PaperList.vue';
import * as echarts from 'echarts'
import { nextTick } from 'vue';
import PaperCommentVue from "./PaperComment.vue";
const activeName = ref('citing')
const colors = ['#d7ab82', '#919e8b', '#919e8b'];
const citingTotal = ref(0)

const citedTotal = ref(0)

const props = defineProps({
    paperId: String,
    paperInfo: Object
})

function recvTotalCiting(t){
    citingTotal.value = t;
}
function recvTotalCited(t){
    citedTotal.value = t;
}
var citeChart
function chartResize(){
    nextTick(
        ()=>{
            citeChart.resize()
        }
    )

}

onRenderTriggered(() => {
    if(citeChart)
        return;
    nextTick(
        ()=>{
            citeChart = echarts.init(document.getElementById("citeChart"))
            
            var tmpCount = []
            tmpCount.push(...props.paperInfo.counts_by_year)
            tmpCount.sort((a,b)=>a.year-b.year)
            var xSeries = []
            var ySeries = []
            
            for(var item of tmpCount){
                xSeries.push(item.year)
                ySeries.push(item.cited_by_count)
            }
            citeChart.setOption(
                {
                    color:colors,
                    xAxis:{
                        data:xSeries
                    },
                    yAxis:{},
                    series:[
                        {
                            type:'bar',
                            data:ySeries
                        }
                    ]
                }
            )
            window.onresize = function(){
                citeChart.resize()
            }
        }
    )
})



</script>
<style scoped>
.demo-tabs{
    width:100%;
}
.demo-tabs /deep/ .el-tabs__item {
    font-size: 18px;
    font-weight: 800;
}

.demo-tabs /deep/ .el-tabs__content {
    width: 100%;
    height: 96%;
}

.demo-tabs /deep/ .el-tab-pane {
    height: 100%;
    width: 100%;
}

.demo-tabs /deep/ .is-active {
    color: rgb(162, 143, 42);
}

.demo-tabs /deep/ .el-tabs__active-bar {
    background-color: rgb(162, 143, 42);
}

.demo-tabs /deep/ .el-tabs__item:hover {
    color: rgb(162, 143, 42);
}

.demo-tabs /deep/ .el-tabs__header {
    margin-bottom: 5px;
}

</style>