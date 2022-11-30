<template>
    <div class="personal-wrap">
        <div class="avatar_wrap">
            <AvaterWrapVue :personAccount="1" :userInfo="userInfo" :claimed="claimed" :openAlexAccount="0"
                @AbandonPortal="AbandonPortal" />
        </div>
        <div class="article_data_wrap">
            <div class="left">
                <ArticleAndDataVue :documentList="userInfo.documentList" :claimed="claimed"
                    :pageTotalSize="pageTotalSize" @pageChange="pageChange" @DocumentChange="DocumentChange"
                    :dataCountByYear="userInfo.counts_by_year" :author_id="replyUser.open_alex_id" />
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
import { UserFilled } from '@element-plus/icons-vue';
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
            open_access: {
                is_oa: 0,
            },
            authorships: [
                {
                    author: {
                        display_name: 'Harbour'
                    }
                }
            ]
        }
    ],
    counts_by_year: [
        {
            year: 2022, works_count: 8, cited_by_count: 1160
        }
    ]
})
const replyUser = ref({
    open_alex_id: "A12345678debug"
})
const pageTotalSize = ref(10)
// const docummentList = ref([])


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
            if (claimed.value == 1) {// 已认证
                let data = {
                    "entity_type": "works",
                    "params": {
                        "filter": {
                            "author.id": replyUser.value.open_alex_id
                        },
                        "page": 1,
                        "per_page": 10
                    }
                }
                getDocumentList(data)
                getOpenAlexAuthor()
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

const getOpenAlexAuthor = async () => {
    User.GetOpenAlexAuthorById({
        "entity_type": "authors",
        "params": {
            "id": replyUser.value.open_alex_id
        }
    }).then((res) => {
        if (res.data.result == 1) {
            userInfo.value.counts_by_year = res.data.single_data.counts_by_year
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

const getDocumentList = async (data) => {
    console.log('获取文献列表')
    User.GetAuthorDocumentListById(data).then((res) => {
        if (res.data.result == 1) {
            pageTotalSize.value = res.data.list_of_data[0].meta.count
            userInfo.value.documentList = res.data.list_of_data[0].results
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

const pageChange = async (page) => {
    let data = {
        "entity_type": "works",
        "params": {
            "filter": {
                "author.id": replyUser.value.open_alex_id
            },
            "page": page,
            "per_page": 10
        }
    }
    getDocumentList(data)
}

const AbandonPortal = () => {
    getAccountType()
}

const DocumentChange = async () => {
    let data = {
        "entity_type": "works",
        "params": {
            "filter": {
                "author.id": replyUser.value.open_alex_id
            },
            "page": page,
            "per_page": 10
        }
    }
    getDocumentList(data)
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

.avatar_wrap {
    width: 70%;
    min-width: 1280px;
    margin: 2% 0 1% 0;
    height: 25%;
}

.article_data_wrap {
    width: 70%;
    min-width: 1280px;
    height: 72%;
    display: flex;
}

.article_data_wrap .left {
    width: 68%;
    margin-right: 2%;
}

.article_data_wrap .right {
    width: 30%;
}
</style>