<template>
    <div class="personal-wrap">
        <div class="avatar_wrap">
            <AvaterWrapVue :personAccount="0" :userInfo="userInfo" :claimed="1" :openAlexAccount="1"
                @AbandonPortal="AbandonPortal()" @infoChange="infoChange" :openAlexId="openAlexId"/>
        </div>
        <div class="article_data_wrap">
            <div class="left">
                <ArticleAndDataVue :documentList="userInfo.documentList" :claimed="claimed"
                    :pageTotalSize="pageTotalSize" @pageChange="pageChange" 
                    :dataCountByYear="userInfo.counts_by_year" :author_id="openAlexId" :authorNetWork="authorNet"
                    :authorName="userInfo.open_alex_name" :personalAccount="0" />
            </div>
            <div class="right">
                <CoAuthorsVue :claimed="claimed" @coAuthorPageChange="coAuthorPageChange"
                    :authorTotalSize="authorTotalSize" :authorList="coAuthorList" />
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
import { watch, inject} from 'vue';
import { UserFilled } from '@element-plus/icons-vue';
const globalStore = useGlobalStore();


const route = useRoute()
const openAlexId = ref(route.params.tokenid)
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
const authorNet = ref([])
const pageTotalSize = ref(10)
const authorTotalSize = ref(5)
const coAuthorList = ref([])
const reload = inject('reload') //使页面重新刷新
// const docummentList = ref([])

// 当路由参数变化时，页面数据无法更新的时候

onMounted(() => {
    init()
})

watch(() => route.params.tokenid, (newval) => {
    if(newval != undefined) init() // 可能跳转到别的路由
})

const init = () => {
    openAlexId.value = route.params.tokenid
    getOpenAlexAuthor()
    let data = {
        "entity_type": "works",
        "params": {
            "filter": {
                "author.id": openAlexId.value
            },
            "page": 1,
            "per_page": 10
        }
    }
    getDocumentList(data)
    getAuthorNet()
    getFollowList()
}

const getFollowList = async () => {
    User.GetFollowList({}).then((res) => {
        if (res.data.result == 1) {
            // todo 根据关注列表确定follow字段
            userInfo.value.is_follow = false 
            res.data.follow_id_list.forEach(element => {
                if(element == openAlexId.value) userInfo.value.is_follow = true
                console.log(element, openAlexId.value)
            });
            // if(res.data.follow_id_list.array.indexOf(openAlexId) != -1) userInfo.value.is_follow = false 
            // else userInfo.value.is_follow = true
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
            "id": openAlexId.value
        }
    }).then((res) => {
        if (res.data.result == 1) {
            userInfo.value.counts_by_year = res.data.single_data.counts_by_year
            userInfo.value.open_alex_name = res.data.single_data.display_name
            userInfo.value.last_known_institution = res.data.single_data.last_known_institution
            userInfo.value.x_concepts = res.data.single_data.x_concepts
            userInfo.value.display_name = res.data.single_data.display_name
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
        author_id: openAlexId.value
    }).then((res) => {
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
                "author.id": openAlexId.value
            },
            "page": page,
            "per_page": 10
        }
    }
    getDocumentList(data)
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
    for (let i = 8 * (page - 1); i < 8 * page && i < authorNet.value.length ; i++) {
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