<template>
    <div class="data-wrap">
        <el-tabs v-model="activeName" type="card" class="tabs" @tab-click="handleClick">
            <el-tab-pane label="引用量" name="countByYear">
                <div class="count" id="count" v-if="chart1Show"></div>
            </el-tab-pane>
            <el-tab-pane label="专家关系网络" name="authorNetWork">
                <div class="network" id="network" v-if="chart2Show"></div>
                <el-dialog v-model="chart2Dialog" width="30%">
                    <template #title>
                        <span class="dialog-title">与{{ nodedata[choseLine].value }}合著作品如下</span>
                    </template>
                    <div class="dialog-wrap">
                        <div v-for="(item, index) in chart2DialogData" :key="index">
                            <span class="document_title">{{(index +1) + '. ' + item.display_name }}</span>
                            <div class="authors_wrap">
                                <span class="document_authors" v-for="(authoritem, authorindex) in item.authorList"
                                    :key="authorindex">{{ authoritem.display_name }}
                                    <span v-if="authorindex != item.authorList.length - 1">/&nbsp;</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
        {{ chart2DialogData }}
    </div>
</template>
<script setup>
import * as echarts from 'echarts'
// import { nextTick, reactive, readonly } from "vue-demi"

const props = defineProps({
    dataCountByYear: Object,
    authorNetWork: Object,
    tabChange: Boolean
})
const activeName = ref('countByYear')
const dataCount = reactive([
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

onMounted(() => {
    //todo
    //处理documentList 将publication_year与publication_date连接起来
    data1PreProcess(x1data, countdata, citedata)
    // initChart1(x1data, countdata, citedata)
    data2PreProcess(nodedata, linedata)
})

watch(() => props.tabChange, (newVal) => {
    if (newVal && chart1Show.value == false) {
        console.log('发表文献->数据分析')
        nextTick(() => {
            chart1Show.value = true
            nextTick(() => {
                initChart1(x1data, countdata, citedata)

                window.onresize = () => chart1.resize()
                window.addEventListener('resize', () => {
                    chart1.resize()
                })
            })
            console.log(document.getElementById('count'))
        })
    }
})

const handleClick = (tab) => {
    if (tab.paneName == 'authorNetWork' && chart2Show.value == false) {
        nextTick(() => {
            chart2Show.value = true
            nextTick(() => {
                initChart2(nodedata, linedata)
                window.onresize = () => chart2.resize()
                window.addEventListener('resize', () => {
                    chart2.resize()
                })
            })

        })
    } else if (tab.paneName == 'countByYear' && chart1Show.value == false) {
        nextTick(() => {
            chart1Show.value = true
            nextTick(() => {
                initChart1(x1data, countdata, citedata)

                window.onresize = () => chart1.resize()
                window.addEventListener('resize', () => {
                    chart1.resize()
                })
            })
            console.log(document.getElementById('count'))
        })
    }
}

const data1PreProcess = (xdata, countdata, citedata) => {
    dataCount.sort(function (a, b) {
        return a.year - b.year
    })
    dataCount.forEach((item, index) => {
        xdata.push(item.year)
        countdata.push(item.work_count)
        citedata.push(item.cited_by_count)
    })
}

const colors = reactive(['#ff8400', '#03fc62', '#aa61b2', '#0a95e6', '#00fff7', '#f06467', '#f06467', '#03fc62', '#00fff7', '#f06467'])

const data2PreProcess = (nodedata, linedata) => {
    let i
    for (i = 0; i < 15; i++) {
        nodedata.push(
            {
                "name": i,
                "value": "学者姓名",
                x: i == 0 ? 65 : 0,
                y: i == 0 ? 6 : 0,
                "symbolSize": i == 0 ? 120 : 80,
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

    for (i = 1; i < 15; i++) {
        linedata.push({
            source: 0,
            target: i,
            value: i,
            tooltip: {
                formatter: '合著数量 {c}',
            },
            //合著的作品
            coArticles: [
                {
                    display_name: '鸡你太美鸡你太美迎面的你走来逐渐让我蠢蠢欲动，这种感觉从未有过cause I get a crash on you',
                    publication_date: '2022-2-11',
                    cited_by_count: '11',
                    authorList: [
                        {
                            display_name: "harbour",
                            id: '',
                        },
                        {
                            display_name: "harbour",
                            id: '',
                        },
                        {
                            display_name: "harbour",
                            id: '',
                        },
                    ]
                },
                {
                    display_name: '你是我的，我是你的谁',
                    publication_date: '2022-4-31',
                    cited_by_count: '11',
                    authorList: [
                        {
                            display_name: "harbour",
                            id: '',
                        },
                        {
                            display_name: "harbour",
                            id: '',
                        },
                        {
                            display_name: "harbour",
                            id: '',
                        },
                    ]
                },
                {
                    display_name: '再多一眼，看一眼就会爆炸，在近一点靠近点快被融化',
                    publication_date: '2022-4-31',
                    cited_by_count: '10',
                    authorList: [
                        {
                            display_name: "harbour",
                            id: '',
                        },
                        {
                            display_name: "harbour",
                            id: '',
                        },
                        {
                            display_name: "harbour",
                            id: '',
                        },
                    ]
                },]
        })
    }

    linedata.push({
        source: 2,
        target: 6,
        value: 'articleName',
    })

    linedata.push({
        source: 5,
        target: 10,
        value: 'articleName'
    })
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
            right: '15%',
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
            data: ['发表文献', '引用数量', '发表文献', '引用数量']
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
                position: 'right',
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
                offset: 80,
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
            {
                type: 'value',
                name: '发表文献',
                position: 'left',
                alignTicks: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[2]
                    }
                },
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '引用数量',
                position: 'left',
                alignTicks: true,
                offset: 80,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[2]
                    }
                },
                axisLabel: {
                    formatter: '{value}'
                }
            }
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
            {
                name: '发表文献',
                type: 'line',
                yAxisIndex: 2,
                data: countdata
            },
            {
                name: '引用数量',
                type: 'line',
                yAxisIndex: 3,
                data: citedata
            }
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
                repulsion: 30,
                edgeLength: 10
            },
            roam: true,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    formatter: '{c}',
                    fontSize: 16,
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
    font-size: 20px;
    font-weight: 600;
}

#tab-authorNetWork {
    font-size: 20px;
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
}

.dialog-title {
    font-size: 24px;
    text-align: center;
    font-weight: 600;
}

.document_title {
    margin-top: 5px;
    font-size: 20px;
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
    font-size: 17px;
    color: grey;
    cursor: pointer;
}
</style>