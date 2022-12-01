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
import { UserFilled } from '@element-plus/icons-vue';
const globalStore = useGlobalStore();


const route = useRoute()
const openAlexId = route.params.tokenid
const claimed = ref(1) // 0 未认证 1 认证 2认证中 在openalexaccount为0时候有效 当网站用户认证的时候 发表文献和数据分析以合作作者采用openalex作者页面的数据
const openAlexAccount = ref(0) // 0 网站用户 1 openalex作者
// const otherAcountType = ref() // 他人账户 0 未认证的网站用户 1 认证的网站用户或者是未认证的原生作者
const userInfo = ref({
    user_id: "20373638",
    display_name: 'Harbour',
    open_alex_name: 'HandSome Harbour',
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
    is_follow: false,
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

const authorNet = ref([])
const pageTotalSize = ref(10)
const authorTotalSize = ref(5)
const coAuthorList = ref([])
// const docummentList = ref([])


onMounted(() => {
    getOpenAlexAuthor()
    let data = {
        "entity_type": "works",
        "params": {
            "filter": {
                "author.id": openAlexId
            },
            "page": 1,
            "per_page": 10
        }
    }
    getDocumentList(data)
    getAuthorNet()
    getFollowList()
})

const getFollowList = async () => {
    User.GetFollowList({}).then((res) => {
        if (res.data.result == 1) {
            // todo 根据关注列表确定follow字段
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
            "id": openAlexId
        }
    }).then((res) => {
        if (res.data.result == 1) {
            userInfo.value.counts_by_year = res.data.single_data.counts_by_year
            userInfo.value.open_alex_name = res.data.single_data.display_name
            userInfo.value.last_known_institution = res.data.single_data.last_known_institution.display_name
            userInfo.value.x_concepts = res.data.single_data.x_concepts
            userInfo.value.display_name = res.data.single_data.display_name
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
        author_id: openAlexId
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
                "author.id": openAlexId
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
    for (let i = 5 * (page - 1); i < 5 * page; i++) {
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(230, 230, 230, 0.234);
}

.avatar_wrap {
    width: 70%;
    min-width: 1280px;
    margin: 0.5% 0 0.5% 0;
    height: 27%;
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
    /* box-shadow: 3px 6px 10px 5px #888888; */
}

.article_data_wrap .right {
    width: 30%;
    /* box-shadow: 3px 6px 10px 5px #888888; */
}
</style>