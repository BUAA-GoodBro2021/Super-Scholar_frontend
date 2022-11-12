<template>
    <div class="data-wrap">
        <el-tabs v-model="activeName" type="card" class="tabs" @tab-click="handleClick">
            <el-tab-pane label="引用量" name="countByYear">
                <div class="count" id="count" v-if="props.tabChange"></div>
            </el-tab-pane>
            <el-tab-pane label="专家关系网络" name="authorNetWork">
                <div class="network" id="network"></div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { nextTick, reactive } from "vue-demi"

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

const handleClick = () => {
    console.log('click');
}

onMounted(() => {
    //todo
    //处理documentList 将publication_year与publication_date连接起来
    data1PreProcess(x1data, countdata, citedata)
    // initChart1(x1data, countdata, citedata)


})

watch(() => props.tabChange, (newVal) => {
    if (newVal) {
        console.log('发表文献->数据分析')
        // console.log(document.getElementById('count').style.height)
        nextTick(() => {
            console.log(document.getElementById('count'))
            initChart1(x1data, countdata, citedata)

            window.onresize = () => chart1.resize()
            window.addEventListener('resize', () => {
                chart1.resize()
            })
            // window.onresize = () => chart1.resize()
        })
    }
})

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
</style>