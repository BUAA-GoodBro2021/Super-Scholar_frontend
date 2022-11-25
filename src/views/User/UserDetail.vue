<template>
    <div class="wrap">
        <div class="avatar_wrap">
            <AvaterWrapVue :personAccount="2" :userInfo="userInfo" :claimed="claimed"/>
        </div>
        <div class="article_data_wrap">
            <div class="left">
                <ArticleAndDataVue :documentList="userInfo.documentList" :claimed="claimed"/>
            </div>
            <div class="right">
                <CoAuthorsVue :claimed="claimed"/>
            </div>
        </div>
    </div>
</template>
<script setup>
import AvaterWrapVue from '../UserComponents/AvaterWrap.vue';
import ArticleAndDataVue from '../UserComponents/ArticleAndData.vue';
import CoAuthorsVue from '../UserComponents/CoAuthors.vue';
const route = useRoute()
const tokenid = route.params.tokenid
const claimed = ref(0)  // 0 未认证 1 已认证
const userInfo = ref({
    id: "20373638",
    display_name: 'Harbour',
    last_known_institution: "Hogwarts",
    x_concepts: [
        {
            id: "",
            display_name: "鸡你太美",
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
    getAccountType()
    myAcountType.value = 0
    // otherAcountType.value = 0
})

const getAccountType = () => {
    //todo 获取id所对应的myAcountType与otherAccountType
}

</script>
<style scoped>
.wrap{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(230, 230, 230, 0.234);
}

.avatar_wrap{
    width: 70%;
    margin: 2vh 0 3vh 0;
    height: 25vh;
}

.article_data_wrap{
    width: 70%;
    min-height: 68vh;
    height: auto;

    display: flex;
}

.article_data_wrap .left{
    width: 65%;
    margin-right: 5%;
}

.article_data_wrap .right{
    width: 30%;
}
</style>