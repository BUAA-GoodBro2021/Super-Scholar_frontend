<template>
    <div class="data-wrap">
        <el-tabs v-model="activeName" type="card" class="tabs" @tab-click="handleClick">
            <el-tab-pane label="引用量" name="countByYear">
                <div class="count" id="count" v-if="chart1Show"></div>
            </el-tab-pane>
            <el-tab-pane label="专家关系网络" name="authorNetWork">
                <div class="network" id="network" v-if="chart2Show"></div>
                <el-dialog v-model="chart2Dialog" width="50%" height="60%">
                    <template #header>
                        <span class="dialog-title">与{{ nodedata[choseLine].value }}合著作品如下</span>
                    </template>
                    <div class="dialog-wrap">
                        <div v-for="(item, index) in chart2DialogData" :key="index">
                            <span class="document_title">{{ (index + 1) + '. ' + item.work_name }}</span>
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
import { refWithControl } from '@vueuse/shared';
import * as echarts from 'echarts'
import { watch } from 'vue';
// import { nextTick, reactive, readonly } from "vue"

const props = defineProps({
    dataCountByYear: Object,
    tabChange: Boolean,
    authorNetWork: Array,
    authorName: String
})
const activeName = ref('countByYear')
const dataCount = refWithControl([
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
let x1data = [], countdata = [], citedata = []
let nodedata = [], linedata = []
const chart1Show = ref(false)
const chart2Show = ref(false)
const chart2Dialog = ref(false)
const chart2DialogData = ref([])
const choseLine = ref()
const changeToDataAnalyse = ref(false) // 记录跳转到数据分析tab页面的行为是否发生过

onMounted(() => {
    //todo
    //处理documentList 将publication_year与publication_date连接起来
    // data1PreProcess(x1data, countdata, citedata)
    // // initChart1(x1data, countdata, citedata)
    // data2PreProcess(nodedata, linedata)
})

watch(() => props.tabChange, (newVal) => {
    if (newVal) changeToDataAnalyse.value = true
    if (newVal && chart1Show.value == false) {
        console.log('发表文献->数据分析')
        data1PreProcess(x1data, countdata, citedata)
        nextTick(() => {
            chart1Show.value = true
            nextTick(() => {
                initChart1(x1data, countdata, citedata)
                window.onresize = () => chart1.resize()
                window.addEventListener('resize', () => {
                    chart1.resize()
                })
            })
        })
    }
})

// watch(() => props.authorNetWork, (newVal) => {
//     if (changeToDataAnalyse.value == true) {
//         data2PreProcess(nodedata, linedata)
//         nextTick(() => {
//             chart2Show.value = true
//             nextTick(() => {
//                 initChart2(nodedata, linedata)
//                 window.onresize = () => chart2.resize()
//                 window.addEventListener('resize', () => {
//                     chart1.resize()
//                 })
//             })
//         })
//     }
// })

// watch(() => props.dataCountByYear, (newVal) => {
//     console.log('props.dataCountbyYear changed')
// })

const handleClick = (tab) => {
    if (tab.paneName == 'authorNetWork') {
        if (chart2Show.value == false) {
            nextTick(() => {
                chart2Show.value = true
                data2PreProcess(nodedata, linedata)
                nextTick(() => {
                    initChart2(nodedata, linedata)
                    window.onresize = () => chart2.resize()
                    window.addEventListener('resize', () => {
                        chart2.resize()
                        chart1.resize()
                    })
                })

            })
        }
    } else if (tab.paneName == 'countByYear' && chart1Show.value == false) {
        if (chart1Show.value == false) {
            nextTick(() => {
                chart1Show.value = true
                data1PreProcess(x1data, countdata, citedata)
                nextTick(() => {
                    initChart1(x1data, countdata, citedata)

                    window.onresize = () => chart1.resize()
                    window.addEventListener('resize', () => {
                        chart2.resize()
                        chart1.resize()
                    })
                })
                console.log(document.getElementById('count'))
            })
        }
    }
}

const data1PreProcess = (xdata, countdata, citedata) => {
    dataCount.value = []
    // xdata = []
    // countdata = []
    // citedata = []
    dataCount.value.push(...props.dataCountByYear)
    dataCount.value.sort(function (a, b) {
        return a.year - b.year
    })
    dataCount.value.forEach((item, index) => {
        xdata.push(item.year)
        countdata.push(item.works_count)
        citedata.push(item.cited_by_count)
    })
}

const colors = reactive(['#ff8400', '#03fc62', '#aa61b2', '#0a95e6', '#00fff7', '#f06467', '#f06467', '#03fc62', '#00fff7', '#f06467'])

const data2PreProcess = (nodedata, linedata) => {
    // nodedata
    // linedata = []
    nodedata.push({
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
        nodedata.push(
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

    for (let i = 1; i < nodedata.length; i++) {
        linedata.push({
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

const initChart1 = (xdata, countdata, citedata) => {
    chart1 = document.getElementById('count')
    chart1 = echarts.init(chart1)
    const colors = ['#5470C6', '#91CC75', '#EE6666'];
    let option = {
        color: colors,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        grid: {
            right: '20%',
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
                data: xdata
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
                data: countdata
            },
            {
                name: '引用数量',
                type: 'bar',
                yAxisIndex: 1,
                data: citedata
            },
        ]
    };
    option && chart1.setOption(option)
    // window.onresize = () => chart1.resize()
    // window.addEventListener('resize', () => chart1.resize())
}

const initChart2 = (nodedata, linedata) => {
    chart2 = document.getElementById('network')
    chart2 = echarts.init(chart2)
    let option = {
        backgroundColor: 'white',
        tooltip: {
            // formatter: '合著数量{c}',
        },
        animationDurationUpdate: function (idx) {
            // 越往后的数据延迟越大
            return idx * 100;
        },
        animationEasingUpdate: 'bounceIn',
        color: ['#fff', '#fff', '#fff'],
        series: [{
            type: 'graph',
            layout: 'force',
            force: {
                repulsion: 20,
                edgeLength: 7
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
            data: nodedata,
            links: linedata
        }]
    }

    option && chart2.setOption(option)
    chart2.on('click', function (node) {
        console.log(node)
        if (node.dataType == 'edge') {
            chart2DialogData.value = node.data.coArticles
            choseLine.value = node.data.target
            chart2Dialog.value = true
        }
    })
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
}

.network {
    width: 100%;
    height: 100%;
}


.tabs {
    width: 90%;
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

.dialog-wrap {
    padding: 0px 10px 10px 10px;
    height: 400px;
    overflow-y: scroll;
    display: block;
}

.dialog-title {
    font-size: 18px;
    text-align: center;
    font-weight: 600;
}

.document_title {
    margin-top: 5px;
    font-size: 15px;
    line-height: 30px;
    text-align: left;
    height: auto;
    display: block;
    word-break: break-all;
    word-wrap: break-word;
    color: #409eff;
    cursor: pointer;
}

.authors_wrap {
    word-break: break-all;
    word-wrap: break-word;
    line-height: 30px;
}

.document_authors {
    font-size: 10px;
    color: grey;
    cursor: pointer;
}
</style>