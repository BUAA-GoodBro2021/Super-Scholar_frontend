<template>
    <div class="brief_main_wrap">
        <div style="display:grid">
            <div v-html="paperInfo.display_name" style="font-size:2rem"></div>
            <el-divider></el-divider>
            <div class="authors" v-if="paperInfo.authorships">
                <span v-for="(item, index) in paperInfo.authorships" :key="index">
                    <span  class="href_text" @click="gotoAuthorPage(item.author)" ><img class="author-avator" src="https://dl.acm.org/pb-assets/icons/DOs/default-profile-1543932446943.svg" />{{item.author.display_name}}</span>
                    <span v-if="item.institutions.length!=0" class="coor">[<span v-for="(autIns, index) in item.institutions" class="href_text" @click="gotoInstitution(autIns)">
                            {{institutions.findIndex(ins=>autIns.id == ins.id)+1}}<span v-if="index != item.institutions.length - 1">,</span></span>]</span>
                    <span v-if="index != paperInfo.authorships.length - 1">
                        ,&nbsp;
                    </span>
                </span>
            </div>
            <div class="authors" v-else>
                <el-skeleton></el-skeleton>
            </div>
            <div class="institutions" v-if="institutions && institutions.length !=0">
                <el-icon><HomeFilled/></el-icon> &nbsp;
                <span v-for="(ins, index) in institutions" class="href_text" @click="gotoInstitution(ins)">
                    [{{index+1}}] {{ins.display_name}}
                    <span v-if="index != institutions.length - 1">
                        ,&nbsp;
                    </span>
                </span>
            </div>
            
            <div class="source" v-if="paperInfo.host_venue">
                <el-icon><Reading/></el-icon> &nbsp;
                <span v-if="paperInfo.publication_year">
                   {{paperInfo.publication_year}}
                </span>
                &nbsp;
                <span v-if="paperInfo.host_venue.display_name" class="href_text" @click="gotoVenue(paperInfo.host_venue)">
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
        const route = useRoute();
        const router = useRouter();
        return{
            route,
            router
        }
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
        },
        gotoInstitution(concept){
            if(!concept)
            return;
            let { href } = this.router.resolve({
                name: "InstitutionDetail",
                params: {
                    institutionid: concept.id.substring(21),
                },
            });
            window.open(href, "_blank");
        },
        gotoConcept(concept){
            if(!concept)
            return;
            let { href } = this.router.resolve({
                name: "ConceptDetail",
                params: {
                tokenid: concept.id.substring(21),
                },
            });
            window.open(href, "_blank");
        },
        gotoVenue(concept){
            if(!concept)
            return;
            let { href } = this.router.resolve({
                name: "JournalDetail",
                params: {
                journalid: concept.id.substring(21),
                },
            });
            window.open(href, "_blank");
        },
        gotoAuthorPage(concept){
            if(!concept)
            return;
            let { href } = this.router.resolve({
                name: "OpenAlexAuthorDetail",
                params: {
                tokenid: concept.id.substring(21),
                },
            });
            window.open(href, "_blank");
        }
    },
    
    

});

</script>
<style>
.authors{
    margin-bottom: 10px;
}
.institutions{
    margin-bottom: 10px;
}
.coor{
    font-size:0.1rem;
    vertical-align: top;
}
.href_text {
    color: rgb(48, 48, 48);
    background-color: transparent;
    transition: .2s;
    cursor:pointer;
}

.href_text:hover {
    color: rgb(64, 158, 255);
}

img {
    max-width: 100%;
    border-style: none;
  }
  .author-avator {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: .3125rem;
    box-sizing: content-box;
    vertical-align: middle;
    padding-right: 0;
    border-radius: 50%;
    object-fit: cover;
    object-position: top;
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
</style>