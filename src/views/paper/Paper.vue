<template>
    <div class="wrap">
        <div class="article_top_bg">
                <el-row class="article_top_warp">
                    <el-col :span="18" class="article_brief_wrap">
                        <PaperBriefVue :paperInfo="paperInfo" v-if="paperInfo"/>
                    </el-col>
                    <el-col :span="6" class="article_brief_wrap">
                        
                    </el-col>
                </el-row>
        </div>
        <div class="article_data_bg">
            <div class="article_data_wrap">
                <div class="left">
                    <ArticleAndDataVue :documentList="userInfo.documentList" />
                </div>
                <div class="right">
                    <CoAuthorsVue />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import PaperBriefVue from './PaperBrief.vue';
import ArticleAndDataVue from '../UserComponents/ArticleAndData.vue';
import CoAuthorsVue from '../UserComponents/CoAuthors.vue';
import { Search } from "../../api/search";
const route = useRoute()
const tokenid = route.params.tokenid
const myAcountType = ref() // 自己的账户标志 0 非个人账户 1 个人账户未认证 2 个人账户认证且认证通过 3 个人账户认证但是在审核中
const paperInfo = ref()

const userInfo = ref({
    id: "20373638",
    display_name: 'Harbour',
    last_known_institution: "Hogwarts",
    x_concepts: [
        {
            id: "",
            display_name: "鸡你太",
            level: 2,
            score: 99.99,
        },
        {
            id: "",
            display_name: "baby",
            level: 2,
            score: 99.99,
        },
        {
            id: "",
            display_name: "鸡你实在实在太美",
            level: 2,
            score: 99.99,
        },
    ],
    avatar_url: "",
    accountType: '',
    is_follow: true,
    documentList: [
        {
            display_name: '鸡你太美鸡你太美迎面的你走来逐渐让我蠢蠢欲动，这种感觉从未有过cause I get a crash on you',
            publication_date: '2022-2-11',
            cited_by_count: '11',
        },
        {
            display_name: '你是我的，我是你的谁',
            publication_date: '2022-4-31',
            cited_by_count: '11',
        },
        {
            display_name: '再多一眼，看一眼就会爆炸，在近一点靠近点快被融化',
            publication_date: '2022-4-31',
            cited_by_count: '11',
        }
    ]
})


onMounted(() => {
    myAcountType.value = 0
    // otherAcountType.value = 0
    Search.single(
        {
            entity_type: "works",
            params: {
                id: "W2741809807"
            }
        }
    ).then((res)=>{
        console.log(res)
        paperInfo.value = res.data.single_data
        })
    })

</script>
<style scoped>
.wrap{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
@keyframes dropdown{
    0%{opacity: 0;}
    100%{opacity: 1;}
}
.article_top_bg{
    box-shadow: 0px 2px 4px inset skyblue;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
    animation: dropdown 1s 1;
}
.article_top_warp{
    width: 80%;
}
.article_brief_wrap{
}

.article_data_wrap{
    width: 80%;
    min-height: 68vh;
    height: auto;
    display: flex;
}
.article_data_bg{
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 68vh;
    height: auto;
    background-color: rgba(230, 230, 230, 0.234);
    display: flex;
    padding: 20px 20px 0px 20px;
    border-radius: 5px 5px 0px 0px;
    box-shadow: 0px 2px 4px inset skyblue;
}

.article_data_wrap .left{
    width: 70%;
    margin-right: 20px;
    box-shadow: 0px 0px 10px skyblue;
    border-radius: 10px 10px 0px 0px;
}

.article_data_wrap .right{
    width: 30%;
    box-shadow: 0px 0px 10px skyblue;
    border-radius: 10px 10px 0px 0px;
}
</style>