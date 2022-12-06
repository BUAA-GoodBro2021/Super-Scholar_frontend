<template>
    <el-collapse :model-value="['1','2']">
      <el-collapse-item title="领域" name="1">
        <el-scrollbar max-height="80vh">
            <ul>
                <li v-for="(item, index) in paperInfo.concepts" :key="index">
                    - {{item.display_name}}
                </li>
            </ul>
        </el-scrollbar>
      </el-collapse-item>
      <el-collapse-item title="相关文献" name="2">
        <el-scrollbar max-height="100vh">
            <div v-for="(item, index) in related" :key="index" v-html="item.display_name" style="margin-bottom:10px"></div>
        </el-scrollbar>
      </el-collapse-item>
    </el-collapse>
</template>
<script setup>
import {
    
} from '@element-plus/icons-vue'
import { Search } from "../../api/search";
const related = ref([])

const props = defineProps({
    paperInfo: Object,
    paperId: String
})
onMounted(() => {
    Search.getSearchDataList(
        {
            entity_type: "works",
            params: {
                related_to: props.paperId
            }
        }
    ).then((res)=>{
        related.value = res.data.list_of_data[0].results
        })
    })
</script>
<style>

</style>