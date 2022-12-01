<template>
    <div class="brief_main_wrap">
        <div class="title_profile">
            <div v-html="paperInfo.display_name" style="font-size:24px"></div>
            <el-divider></el-divider>
            <div class="authors" v-if="paperInfo.authorships">
                <el-icon><UserFilled /></el-icon> &nbsp;
                <span v-for="(item, index) in paperInfo.authorships" :key="index">
                    {{item.author.display_name}}
                    [
                    <span v-for="(autIns, index) in item.institutions">
                        {{institutions.findIndex(ins=>autIns.id == ins.id)+1}}
                        <span v-if="index != item.institutions.length - 1">
                            ,&nbsp;
                        </span>
                    </span>
                    ]
                    <span v-if="index != paperInfo.authorships.length - 1">
                        ,&nbsp;
                    </span>
                </span>
            </div>
            <div class="authors" v-else>
                <el-skeleton></el-skeleton>
            </div>
            <div class="institutions" v-if="institutions">
                <el-icon><HomeFilled/></el-icon> &nbsp;
                <span v-for="(ins, index) in institutions">
                    [{{index+1}}] {{ins.display_name}}
                    <span v-if="index != institutions.length - 1">
                        ,&nbsp;
                    </span>
                </span>
            </div>
            <div class="institutions" v-else>
                <el-skeleton></el-skeleton>
            </div>
            <div class="source" v-if="paperInfo.host_venue">
                <el-icon><Reading/></el-icon> &nbsp;
                <span v-if="paperInfo.publication_year">
                   {{paperInfo.publication_year}}
                </span>
                &nbsp;
                <span v-if="paperInfo.host_venue.display_name">
                    {{paperInfo.host_venue.display_name}}
                </span>
                &nbsp;|&nbsp;
                <span v-if="paperInfo.biblio.volume">
                    Volume: {{paperInfo.biblio.volume}}
                </span>
                &nbsp;
                <span v-if="paperInfo.biblio.issue">
                    Issue: {{paperInfo.biblio.issue}}
                </span>
                &nbsp;
                <span v-if="paperInfo.biblio.first_page">
                    pp: {{paperInfo.biblio.first_page}}
                </span>
                <span v-if="paperInfo.biblio.last_page">
                     - {{paperInfo.biblio.last_page}}
                </span>
            </div>
            <div class="source" v-else>
                <el-skeleton></el-skeleton>
            </div>
        </div>
                
    </div>
</template>
<script>

import {
  Menu,
  Loading,
  UserFilled,
  Reading,
  HomeFilled,
User,
} from '@element-plus/icons-vue'



export default defineComponent({
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
                _this.updateInstitutions()
            }
        )
    },
    data(){
        return{
            institutions :ref([])
        }
    },
    methods: {
        updateInstitutions(){
            for(const aut of this.paperInfo.authorships){
                for(const autIns of aut.institutions){
                    if(!this.institutions.find(
                        (ins,idx,arr)=>{
                            return ins.id == autIns.id
                        }
                    )){
                        this.institutions.push(autIns)
                    }
                }
            }
        }
    },
    
    

});
</script>
<style>

</style>