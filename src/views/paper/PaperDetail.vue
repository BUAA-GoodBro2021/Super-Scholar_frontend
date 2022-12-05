<template>
        <el-tabs v-model="activeName" >
            <el-tab-pane :label="'参考文献 '+ citingTotal" name="citing" class="tab-pane">
                <PaperListVue :total="citingTotal" :filter="{cited_by: paperId}" @IKnowTotal="recvTotalCiting"/>
            </el-tab-pane>
            <el-tab-pane :label="'引证文献 ' + citedTotal" name="citedBy" class="tab-pane">
                <div ref="citeChart" style="width: 100%; height: 400px"></div>
                <PaperListVue  :filter="{cites: paperId}"  @IKnowTotal="recvTotalCited"/>
            </el-tab-pane>
            <el-tab-pane label="评论" name="comments" class="tab-pane">
                
            </el-tab-pane>
        </el-tabs>
</template>
<script setup>
import PaperListVue from './PaperList.vue';
import * as echarts from 'echarts'
const citeChart = ref()

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

onMounted(() => {

})



</script>
<style scoped>


</style>