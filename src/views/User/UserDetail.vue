<template>
    <div v-if="isLoading">
        <SandboxLoading />
    </div>
    <div class="personal-wrap">
        <div class="avatar_wrap">
            <AvaterWrapVue :personAccount="0" :userInfo="userInfo" :claimed="claimed" :openAlexAccount="0"
                @AbandonPortal="AbandonPortal()" @infoChange="infoChange"/>
        </div>
        <div class="article_data_wrap">
            <div class="left">
                <ArticleAndDataVue :documentList="userInfo.documentList" :claimed="claimed"
                    :pageTotalSize="pageTotalSize" @pageChange="pageChange" 
                    :dataCountByYear="userInfo.counts_by_year" :author_id="replyUser.open_alex_id" 
                    :authorNetWork="authorNet" :authorName="userInfo.open_alex_name" :personalAccount="0"/>
            </div>
            <div class="right">
                <CoAuthorsVue :claimed="claimed" @coAuthorPageChange="coAuthorPageChange" :authorTotalSize="authorTotalSize" :authorList="coAuthorList"/>
            </div>
        </div>
    </div>
</template>
<script setup>
import SandboxLoading from "../../components/Loading/SandboxLoading.vue";
import ClaimPortalVue from './ClaimPortal.vue';
import AvaterWrapVue from '../../components/UserComponents/AvaterWrap.vue';
import ArticleAndDataVue from '../../components/UserComponents/ArticleAndData.vue';
import CoAuthorsVue from '../../components/UserComponents/CoAuthors.vue';
import { useGlobalStore } from "../../stores/global.js";
import { User } from "../../api/userDetail"
import { ElNotification } from "element-plus";
import { watch} from 'vue';
import { UserFilled } from '@element-plus/icons-vue';
const globalStore = useGlobalStore();
const isLoading = ref(true)
const info = ref(0)


const route = useRoute()
const tokenid = route.params.tokenid
const claimed = ref(1) // 0 未认证 1 认证 2认证中 在openalexaccount为0时候有效 当网站用户认证的时候 发表文献和数据分析以合作作者采用openalex作者页面的数据
const openAlexAccount = ref(0) // 0 网站用户 1 openalex作者
// const otherAcountType = ref() // 他人账户 0 未认证的网站用户 1 认证的网站用户或者是未认证的原生作者
const userInfo = ref({
    user_id: "",
    display_name: '',
    open_alex_name: '',
    last_known_institution: "",
    email: '',
    introduction: '',
    x_concepts: [
    ],
    avatar_url: "",
    accountType: '',
    is_follow: true,
    documentList: [
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
const authorNet = ref([])
const pageTotalSize = ref(10)
const authorTotalSize = ref(5)
const coAuthorList = ref([])
// const docummentList = ref([])

watch(() => route.params.tokenid, (newval) => {
    if(newval != undefined) {
        isLoading.value = true
        info.value = 0
        getAccountType(1)
    }
})



onMounted(() => {
    getAccountType(1)
})

const ConvertUserInfo = (data) => {
    userInfo.value.display_name = data.username
    userInfo.value.real_name = data.real_name ? data.real_name : ''
    userInfo.value.open_alex_id = data.open_alex_id ? data.open_alex_id : ''
    userInfo.value.email = data.email
    userInfo.value.user_id = data.user_id
    userInfo.value.introduction = data.introduction ? data.introduction : null
    userInfo.value.avatar_url = data.avatar_url
}

/*type 0 值获取个人信息 用于修改个人简介昵称之后使用 1 获取个人信息同时获取文献 专家关系网络 */
const getAccountType = (type) => {
    //todo 获取id所对应的myAcountType与otherAccountType
    User.GetUserDetail({
        user_id: tokenid
    }).then((res) => {
        if (res.data.result == 1) {
            replyUser.value = res.data.user
            claimed.value = res.data.user.is_professional == -1 ? 0 : res.data.user.is_professional == 0 ? 2 : 1
            ConvertUserInfo(res.data.user)
            if (claimed.value == 1 && type == 1) {// 已认证
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
                getAuthorNet()
            } else {
                isLoading.value = false
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
        info.value++
        if(info.value == 3) isLoading.value = false
        if (res.data.result == 1) {
            userInfo.value.counts_by_year = res.data.single_data.counts_by_year
            userInfo.value.open_alex_name = res.data.single_data.display_name
            userInfo.value.works_count = res.data.single_data.works_count
            userInfo.value.cited_by_count = res.data.single_data.cited_by_count
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
    User.GetAuthorDocumentListById(data).then((res) => {
        info.value++
        if(info.value == 3) isLoading.value = false
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

const getAuthorNet = async () => {
    User.GetAuthorNetById({
        author_id: replyUser.value.open_alex_id
    }).then((res) => {
        info.value++
        if(info.value == 3) isLoading.value = false
        if (res.data.result == 1) {
            authorNet.value = res.data.cooperation_author_list
            authorTotalSize.value = res.data.cooperation_author_count
            UpdateCoAuthor(1)
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
    getAccountType(0)
}


const coAuthorPageChange = (page) => {
    // 切割作者列表
    UpdateCoAuthor(page)
}

const infoChange = () => {
    getAccountType(0)
}

const UpdateCoAuthor = (page) => {
    coAuthorList.value = []
    for(let i = 8 * (page - 1) ; i < 8 * page && i < authorNet.value.length; i++) {
        coAuthorList.value.push(authorNet.value[i])
    }
    // console.log(coAuthorList.value)
}
</script>
<style scoped>
.personal-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    padding-bottom: 0.5%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(230, 230, 230, 0.234);
}

.avatar_wrap {
    width: 70%;
    /* min-width: 1280px; */
    margin: 0.5% 0 0.5% 0;
    height: 27%;
}

.article_data_wrap {
    width: 70%;
    /* min-width: 1280px; */
    height: 72%;
    display: flex;
    
}

.article_data_wrap .left {
    width: 68%;
    margin-right: 2%;
    /* box-shadow: 3px 6px 10px 5px #888888; */
}

.article_data_wrap .right {
    width: 30%;
    /* box-shadow: 3px 6px 10px 5px #888888; */
}

@media (max-width: 1500px) {
    .avatar_wrap {
        width: 90%;
        /* border: 2px solid red; */
    }

    .article_data_wrap {
        width: 90%;
    }
}

@media (max-width: 1200px) {
    .avatar_wrap {
        width: 98%;
        /* border: 2px solid red; */
    }

    .article_data_wrap {
        width: 98%;
        flex-wrap: wrap;
    }

    .article_data_wrap .left {
        width: 100%;
        margin: 10px 0 10px 0;
        /* box-shadow: 3px 6px 10px 5px #888888; */
    }

    .article_data_wrap .right {
        width: 100%;
        /* box-shadow: 3px 6px 10px 5px #888888; */
    }
}
</style>