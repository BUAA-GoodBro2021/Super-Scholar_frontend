<template>
        <el-tabs v-model="activeName" >
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
                
            </el-tab-pane>
        </el-tabs>
</template>
<script setup>
import PaperListVue from './PaperList.vue';
import * as echarts from 'echarts'
import { nextTick } from 'vue';

const activeName = ref('citing')

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
onRenderTriggered(() => {
    if(citeChart)
        return;
    nextTick(
        ()=>{
            citeChart = echarts.init(document.getElementById("citeChart"))
            var xSeries = []
            var ySeries = []
            
            for(var item of props.paperInfo.counts_by_year){
                xSeries.push(item.year)
                ySeries.push(item.cited_by_count)
            }
            citeChart.setOption(
                {
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


</style>