<template>
    <div class="personal-wrap">
        <div class="avatar_wrap">
            <AvaterWrapVue :personAccount="1" :userInfo="userInfo" :claimed="claimed" :openAlexAccount="0" />
        </div>
        <div class="article_data_wrap">
            <div class="left">
                <ArticleAndDataVue :documentList="userInfo.documentList" :claimed="claimed" />
            </div>
            <div class="right">
                <CoAuthorsVue :claimed="claimed" />
            </div>
        </div>
    </div>
</template>
<script setup>
import ClaimPortalVue from './ClaimPortal.vue';
import AvaterWrapVue from '../../components/UserComponents/AvaterWrap.vue';
import ArticleAndDataVue from '../../components/UserComponents/ArticleAndData.vue';
import CoAuthorsVue from '../../components/UserComponents/CoAuthors.vue';
import { useGlobalStore } from "../../stores/global.js";
import { User } from "../../api/userDetail"
import { ElNotification } from "element-plus";
const globalStore = useGlobalStore();


const route = useRoute()
const tokenid = route.params.tokenid
const claimed = ref(1) // 0 未认证 1 认证 2认证中 在openalexaccount为0时候有效 当网站用户认证的时候 发表文献和数据分析以合作作者采用openalex作者页面的数据
const openAlexAccount = ref(0) // 0 网站用户 1 openalex作者
// const otherAcountType = ref() // 他人账户 0 未认证的网站用户 1 认证的网站用户或者是未认证的原生作者
const userInfo = ref({
    user_id: "20373638",
    display_name: 'Harbour',
    last_known_institution: "Hogwarts",
    email: '2358272468@qq.com',
    introduction: '中分头 背带裤 我是ikun你记住 山外青山楼外楼 唱跳rap打篮球 ',
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
            pdf: 0,
        },
        {
            display_name: '你是我的，我是你的谁',
            publication_date: '2022-4-31',
            cited_by_count: '11',
            pdf: 1,
        },
        {
            display_name: '再多一眼，看一眼就会爆炸，在近一点靠近点快被融化',
            publication_date: '2022-4-31',
            cited_by_count: '11',
            pdf: -1,
        }
    ]
})
const replyUser = ref()


onMounted(() => {
    getAccountType()
})

const ConvertUserInfo = (data) => {
    userInfo.value.display_name = data.username
    userInfo.value.email = data.email
    userInfo.value.user_id = data.user_id
    userInfo.value.introduction = data.introduction ? data.introduction : null
}

const getAccountType = () => {
    //todo 获取id所对应的myAcountType与otherAccountType
    User.GetUserDetail().then((res) => {
        if (res.data.result == 1) {
            replyUser.value = res.data.user
            claimed.value = res.data.user.is_professional == -1 ? 0 : res.data.user.is_professional == 0 ? 2 : 1
            ConvertUserInfo(res.data.user)
            if (claimed == 1) {// 已认证
                getDocumentList()
            }
        } else {
            ElNotification({
                title: "很遗憾",
                message: res.message,
                type: "error",
                duration: 3000
            })
        }
    }).catch((err) => {
        ElNotification({
            title: "很遗憾",
            message: err.message,
            type: "error",
            duration: 3000
        })
    })
}
const getDocumentList = async () => {
    User.GetAuthorDocumentListById({
        "entity_type": "works",
        "params": {
            "filter": {
                "author.id": replyUser.open_alex_id
            },
            "page": 1,
            "per_page": 25
        }
    }).then((res) => {
        console.log(res)
    }).catch((err) => {
        ElNotification({
            title: "很遗憾",
            message: err.message,
            type: "error",
            duration: 3000
        })
    })

    User.GetOpenAlexAuthorById({
        "entity_type": "authors",
        "params": {
            "id": replyUser.open_alex_id
        }
    }).then((res) => {
        console.log(res)
    }).catch((err) => {
        ElNotification({
            title: "很遗憾",
            message: err.message,
            type: "error",
            duration: 3000
        })
    })
}
</script>
<style scoped>
.personal-wrap {
    width: 100%;
    height: 95%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(230, 230, 230, 0.234);
}

.avatar_wrap{
    width: 70%;
    min-width: 1280px;
    margin: 2% 0 1% 0;
    height: 25%;
}

.article_data_wrap{
    width: 70%;
    min-width: 1280px;
    height: 72%;
    display: flex;
}

.article_data_wrap .left{
    width: 68%;
    margin-right: 2%;
}

.article_data_wrap .right{
    width: 30%;
}
</style>