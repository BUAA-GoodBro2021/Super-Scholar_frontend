<template>
    <div class="data-wrap">
        <el-tabs v-model="activeName" type="card" class="tabs" @tab-click="handleClick">
            <el-tab-pane label="引用量" name="countByYear">
                <div class="count" id="count" v-if="chart1Show"></div>
            </el-tab-pane>
            <el-tab-pane label="专家关系网络" name="authorNetWork">
                <div class="network" id="network" v-if="chart2Show"></div>
                <el-dialog v-model="chart2Dialog" class="dialog-entity">
                    <template #header>
                        <span class="dialog-title">与{{ nodedata[choseLine].value }}合著作品如下</span>
                    </template>
                    <div class="dialog-wrap">
                        <div v-for="(item, index) in chart2DialogData" :key="index">
                            <!-- <span class="document_title document_index">{{ (index + 1) + '. ' }}</span>
                            <WorksResCard :item="item" /> -->
                            <div class="document-title-wrap">
                                <!-- <span class="document_title document_index">{{ (index + 1) + '. ' }}</span>&nbsp;&nbsp;
                                <span class="document_title" @click="toArticle(item)">{{ item.work_name }}</span> -->
                                <span class="document_title document_index">{{ (index + 1) + '. ' }}</span>
                                <WorksResCard :item="item" />
                            </div>
                            <!-- <div class="authors_wrap">
                                <span class="document_authors" v-for="(authoritem, authorindex) in item.authorList"
                                    :key="authorindex">{{ authoritem.display_name }}
                                    <span v-if="authorindex != item.authorList.length - 1">/&nbsp;</span>
                                </span>
                            </div> -->
                        </div>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
        <!-- {{ chart2DialogData }} -->
    </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import WorksResCard from '../../views/search/WorksResCard.vue'
import { Collection } from '../../api/collect'
// import { nextTick, reactive, readonly } from "vue"
const router = useRouter()

const props = defineProps({
    dataCountByYear: Object,
    tabChange: Boolean,
    authorNetWork: Array,
    authorName: String
})
const activeName = ref('countByYear')
const dataCount = ref([
    {
        year: 2022,
        work_count: 12,
        cited_by_count: 11,
    },
    {
        year: 2021,
        work_count: 8,
        cited_by_count: 12,
    },
    {
        year: 2020,
        work_count: 7,
        cited_by_count: 13,
    },
    {
        year: 2019,
        work_count: 15,
        cited_by_count: 6,
    },
    {
        year: 2018,
        work_count: 17,
        cited_by_count: 6,
    },
])
let chart1, chart2;
const x1data = ref([])
const countdata = ref([])
const citedata = ref([])
const nodedata = ref([])
const linedata = ref([])
const chart1Show = ref(false)
const chart2Show = ref(false)
const chart2Dialog = ref(false)
const chart2DialogData = ref([])
const choseLine = ref()
const changeToDataAnalyse = ref(false) // 记录跳转到数据分析tab页面的行为是否发生过

onMounted(() => {
    //todo
    //处理documentList 将publication_year与publication_date连接起来
    // data1PreProcess()
    // // initChart1()
    // data2PreProcess()
})

watch(() => props.tabChange, (newVal) => {
    if (newVal) changeToDataAnalyse.value = true
    if (newVal && chart1Show.value == false) {
        console.log('发表文献->数据分析')
        reInitChart1()
    }
    if (newVal && changeToDataAnalyse.value && activeName.value == 'authorNetWork') {
        chart2Show.value = false
        reInitChart2()
    }

    if (newVal && changeToDataAnalyse.value && activeName.value == 'countByYear') {
        chart1Show.value = false
        reInitChart1()
    }
})

const reInitChart1 = () => {
    nextTick(() => {
        chart1Show.value = true
        data1PreProcess()
        nextTick(() => {
            initChart1()
            window.onresize = () => chart1.resize()
            window.addEventListener('resize', () => {
                chart1.resize()
            })
        })
    })
}

const reInitChart2 = () => {
    nextTick(() => {
        chart2Show.value = true
        data2PreProcess()
        nextTick(() => {
            initChart2()
            window.onresize = () => chart2.resize()
            window.addEventListener('resize', () => {
                chart2.resize()
            })
        })
    })
}

// watch(() => props.authorNetWork, (newVal) => { // 如果数据发生了变化 可能是跳转导致的
//     if (changeToDataAnalyse.value == true) { // 如果之前点击过数据分析 说明第二个panel的dom已经创建
//         data2PreProcess()
//         if(chart2Show.value) chart2Show.value = false // 如果之前初始化过 需要重新初始化 没有初始化过 数据预处理之后设置chartshow为true即可
//         nextTick(() => {
//             chart2Show.value = true
//             nextTick(() => {
//                 initChart2()
//                 window.onresize = () => chart2.resize()
//                 window.addEventListener('resize', () => {
//                     chart2.resize()
//                 })
//             })
//         })
//     }
// })

// watch(() => props.dataCountByYear, (newVal) => {
//     console.log('props.dataCountbyYear changed')
//     if (changeToDataAnalyse.value == true) {
//         data1PreProcess()
//         if(chart1Show.value) chart1Show.value = false
//         nextTick(() => {
//             chart1Show.value = true
//             nextTick(() => {
//                 data1PreProcess()
//                 window.onresize = () => chart1.resize()
//                 window.addEventListener('resize', () => {
//                     chart1.resize()
//                 })
//             })
//         })
//     }
// })

const handleClick = (tab) => {
    if (tab.paneName == 'authorNetWork') {
        if (chart2Show.value == false) {
            reInitChart2()
        } else {
            chart2Show.value = false
            reInitChart2()
        }
    } else if (tab.paneName == 'countByYear') {
        if (chart1Show.value == false) {
            reInitChart1()
        } else {
            chart1Show.value = false
            reInitChart1()
        }
    }
}

const data1PreProcess = () => {
    dataCount.value = []
    x1data.value = []
    countdata.value = []
    citedata.value = []
    dataCount.value.push(...props.dataCountByYear)
    dataCount.value.sort(function (a, b) {
        return a.year - b.year
    })
    dataCount.value.forEach((item, index) => {
        x1data.value.push(item.year)
        countdata.value.push(item.works_count)
        citedata.value.push(item.cited_by_count)
    })
}

const colors = reactive(['#d87c7c', '#919e8b', '#d7ab82', '#6e7074', '#61a0a8', '#efa18d', '#787464', '#cc7e63', '#724e58', '#4b565b'])

const data2PreProcess = () => {
    nodedata.value = []
    linedata.value = []
    nodedata.value.push({
        "name": 0,
        "value": props.authorName,
        x: 65,
        y: 30,
        "symbolSize": 70,
        "draggable": true,
        "itemStyle": {
            "normal": {
                "borderColor": colors[9],
                "borderWidth": 4,
                "shadowBlur": 20,
                "shadowColor": colors[9],
                "color": "#F0F8FF"
            }
        },
        tooltip: {
            formatter: '{c}',
        },
    })
    for (let i = 0; i < props.authorNetWork.length; i++) {
        if (i == 20) break;
        nodedata.value.push(
            {
                "name": i + 1,
                "value": props.authorNetWork[i].author_name,
                x: 0,
                y: 0,
                "symbolSize": 50,
                "draggable": true,
                "itemStyle": {
                    "normal": {
                        "borderColor": colors[i % 10],
                        "borderWidth": 4,
                        "shadowBlur": 20,
                        "shadowColor": colors[i % 10],
                        "color": "#F0F8FF"
                    }
                },
                tooltip: {
                    formatter: '{c}',
                },
            }
        )
    }

    for (let i = 1; i < nodedata.value.length; i++) {
        linedata.value.push({
            source: 0,
            target: i,
            value: props.authorNetWork[i - 1].cooperation_author_count,
            tooltip: {
                formatter: '合著数量 {c}',
            },
            //合著的作品
            coArticles: props.authorNetWork[i - 1].work_list
        })
    }
}

const initChart1 = () => {
    chart1 = document.getElementById('count')
    chart1 = echarts.init(chart1)
    const colors = ['#d7ab82', '#919e8b', '#919e8b'];
    let option = {
        color: colors,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        grid: {
            right: '22%',
            left: '15%'
        },
        toolbox: {
            feature: {
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        legend: {
            data: ['发表文献', '引用数量']
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                // prettier-ignore
                data: x1data.value
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '发表文献',
                position: 'left',
                offset: 40,
                alignTicks: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[0]
                    }
                },
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '引用数量',
                position: 'right',
                alignTicks: true,
                offset: 40,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisLabel: {
                    formatter: '{value} '
                }
            },
        ],
        series: [
            {
                name: '发表文献',
                type: 'bar',
                data: countdata.value
            },
            {
                name: '引用数量',
                type: 'bar',
                yAxisIndex: 1,
                data: citedata.value
            },
        ]
    };
    option && chart1.setOption(option)
    // window.onresize = () => chart1.resize()
    // window.addEventListener('resize', () => chart1.resize())
}

const initChart2 = () => {
    chart2 = document.getElementById('network')
    chart2 = echarts.init(chart2)
    let option = {
        backgroundColor: 'white',
        tooltip: {
            // formatter: '合著数量{c}',
        },
        animationDurationUpdate: function (idx) {
            // 越往后的数据延迟越大
            return idx * 1000;
        },
        // animationEasingUpdate: 'bounceIn',
        color: ['#fff', '#fff', '#fff'],
        series: [{
            type: 'graph',
            layout: 'force',
            force: {
                repulsion: 10,
                edgeLength: 7,
                friction: 0.1
            },
            roam: true,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    formatter: '{c}',
                    fontSize: 11,
                    fontStyle: '400',
                }
            },
            data: nodedata.value,
            links: linedata.value
        }]
    }

    option && chart2.setOption(option)
    chart2.on('click', function (node) {
        console.log(node)
        if (node.dataType == 'edge') {
            choseLine.value = node.data.target
            if (node.data.haveArticle) {
                chart2DialogData.value = node.data.coArticles
                chart2Dialog.value = true
            } else {
                getArticles(node.data)
            }
        } else if (node.dataType == 'node') {
            if (node.data.name != 0) { // 不是自身 跳转
                let { href } = router.resolve({
                    name: 'OpenAlexAuthorDetail',
                    params: { tokenid: props.authorNetWork[node.data.name - 1].author_id }
                })

                window.open(href, "_blank")
            }
        }
    })
}

const getArticles = (data) => {
    if (data.coArticles.length == 0) {
        ElNotification({
            title: "暂无合作文章",
            message: "暂无合作文章",
            type: "warning",
            duration: 3000
        })
        return
    }
    let work_ids = data.coArticles[0].work_id
    for (let i = 1; i < data.coArticles.length; i++) work_ids = work_ids + '|' + data.coArticles[i].work_id
    let tdata = {
        entity_type: 'works',
        params: {
            filter: {
                openalex: work_ids
            },
            page: 1,
            per_page: data.coArticles.length
        }
    }

    chart2Dialog.value = true
    Collection.GetDocumentList(tdata).then((res) => {
        if (res.data.result == 1) {
            chart2DialogData.value = []
            chart2DialogData.value.push(...res.data.list_of_data[0].results)
            data.haveArticle = true
            data.coArticles = []
            data.coArticles.push(...res.data.list_of_data[0].results)
        } else {
            chart2Dialog.value = false
            ElNotification({
                title: res.message,
                message: res.message,
                type: "error",
                duration: 3000
            })
        }
    }).catch((err) => {
        chart2Dialog.value = false
        ElNotification({
            title: err.message,
            message: err.message,
            type: "error",
            duration: 3000
        })
    })
}

const toArticle = (item) => {

}

</script>
<style>
.data-wrap {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.count {
    /* height: 600px;
    width: 600px; */
    height: 100%;
    width: 100%;
    min-height: 350px;
}

.network {
    width: 100%;
    height: 100%;
    min-height: 350px;
}


.tabs {
    width: 95%;
    height: 90%;
    /* margin-top: 10px; */
    margin-bottom: 5%;
}

#tab-countByYear {
    font-size: 16px;
    font-weight: 600;
}

#tab-authorNetWork {
    font-size: 16px;
    font-weight: 600;
}

.el-tabs__content {
    width: 100%;
    height: 100%;
}

.el-tab-pane {
    height: 100%;
    width: 100%;
}

.authorNetWork {
    height: 100%;
    width: 100%;
}

.document-title-wrap {
    display: flex;
}


.dialog-entity {
    width: 80vw;
}

.dialog-wrap {
    padding: 0px 70px 10px 10px;
    min-height: 200px;
    max-height: 400px;
    width: 100%;
    overflow-y: scroll;
    display: block;
}

@media (max-width: 1200px) {
    .dialog-entity {
        width: 95vw;
    }
}

.dialog-title {
    font-size: 18px;
    text-align: center;
    font-weight: 600;
}

.document_title {
    margin-top: .9375rem;
    font-size: 15px;
    line-height: 30px;
    text-align: left;
    height: auto;
    display: block;
    word-break: break-all;
    word-wrap: break-word;
    color: #161717;
    cursor: pointer;
}

.document_index {
    font-weight: 800;
    cursor: default;
}

.document_title:hover {
    color: rgb(162, 143, 42);
}

.authors_wrap {
    word-break: break-all;
    word-wrap: break-word;
    line-height: 30px;
}

.document_authors {
    font-size: 10px;
    /* color: grey; */
    color: rgb(162, 143, 42);
    cursor: pointer;
}
</style>