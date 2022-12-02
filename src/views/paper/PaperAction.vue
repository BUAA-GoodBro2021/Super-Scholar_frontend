<template>
    <el-row style="width:100%;height:100%;padding:0px" justify="space-around" align="middle" type="flex">
        <el-button type="primary" size="large"><el-icon size="large"><Download /></el-icon></el-button>
        <el-button type="success" size="large"><el-icon size="large"><Star /></el-icon></el-button>
        <el-button type="danger" size="large"><el-icon size="large"><View /></el-icon></el-button>
        <el-button type="warning" size="large"><el-icon size="large"><Share /></el-icon></el-button>
    </el-row>
</template>
<script>

import {
Download,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'



export default defineComponent({
    components:{
        Delete,
        Edit,
        Message,
        Search,
        Star
    },
    props:{
        paperInfo: Object
    },
    setup(props){
        const { proxy, ctx } = getCurrentInstance()
        const _this = ctx
        watch(()=>props.paperInfo,
        (newVal,oldVal)=>{

        })
        onMounted(()=>{
                
            }
        )
    },
    data(){
        return{
            institutions :ref([])
        }
    },
    methods: {
        
    },
    
    

});
</script>
<style>

</style>