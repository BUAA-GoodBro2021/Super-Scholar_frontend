<template>
  <div class="data-wrap">
    <div class="count" id="count" v-if="chartShow"></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
const props = defineProps({
  dataCountByYear: Object,
  tabChange: Boolean,
});
let chart;
const dataCount = ref([]);
const xdata = ref([]);
const countdata = ref([]);
const citedata = ref([]);
const tmpDataCount = ref([]);
const tmpXdata = ref([]);
const tmpCountdata = ref([]);
const tmpCitedata = ref([]);
const chartShow = ref(false);
const changeToDataAnalyse = ref(false); // 记录跳转到数据分析tab页面的行为是否发生过

onMounted(() => {
  tmpDataCount.value.push(...props.dataCountByYear);
  tmpDataCount.value.sort(function (a, b) {
    return a.year - b.year;
  });
  tmpDataCount.value.forEach((item, index) => {
    tmpXdata.value.push(item.year);
    tmpCountdata.value.push(item.works_count);
    tmpCitedata.value.push(item.cited_by_count);
  });
});

watch(
  () => props.tabChange,
  (newVal) => {
    if (newVal) changeToDataAnalyse.value = true;
    if (newVal && chartShow.value == false) {
      console.log("发表文献->数据分析");
      reInitChart();
    }
    if (newVal && changeToDataAnalyse.value) {
      chartShow.value = false;
      reInitChart();
    }
  }
);

const reInitChart = () => {
  nextTick(() => {
    chartShow.value = true;
    dataPreProcess();
    nextTick(() => {
      initChart();
      window.onresize = () => chart.resize();
      window.addEventListener("resize", () => {
        chart.resize();
      });
    });
  });
};

const initChart = () => {
  chart = document.getElementById("count");
  chart = echarts.init(chart);
  const colors = ["#d7ab82", "#919e8b", "#919e8b"];
  let option = {
    color: colors,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    grid: {
      right: "20%",
      left: "15%",
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    legend: {
      data: ["发表文献", "引用数量"],
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        data: xdata.value,
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "发表文献",
        position: "left",
        offset: 40,
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[0],
          },
        },
        axisLabel: {
          formatter: "{value}",
        },
      },
      {
        type: "value",
        name: "引用数量",
        position: "right",
        alignTicks: true,
        offset: 40,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[1],
          },
        },
        axisLabel: {
          formatter: "{value} ",
        },
      },
    ],
    series: [
      {
        name: "发表文献",
        type: "bar",
        data: countdata.value,
      },
      {
        name: "引用数量",
        type: "bar",
        yAxisIndex: 1,
        data: citedata.value,
      },
    ],
  };
  option && chart.setOption(option);
};

const dataPreProcess = () => {
  dataCount.value = tmpDataCount.value;
  xdata.value = tmpXdata.value;
  countdata.value = tmpCountdata.value;
  citedata.value = tmpCitedata.value;
};
</script>

<style scoped>
.data-wrap {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.count {
  height: 100%;
  width: 100%;
  min-height: 500px;
}
</style>
