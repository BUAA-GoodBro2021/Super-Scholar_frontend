<template>
  <div id="canvas-container"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const particleColor = ref("#FFFFFF");
const particleNum = ref(180);
const lineColor = ref("#FFFFFF");
const backgroundColor = ref("#040d21");

onMounted(()=>{
  // 1. 创建画布对象  即创建canvas标签的DOM元素
  var the_canvas = document.createElement("canvas");
  // 2. 找到上下文对象（画笔）
  var context = the_canvas.getContext("2d");
  // canvas 三要素之 id，作为canvas标签的唯一标识
  var canvas_id = "c_n";
  // canvas 三要素之 画布内容宽度 width 和 高度 height，和canvas标签的尺寸不一样
  var canvas_width, canvas_height;
  // 当前鼠标放置的位置点
  var current_point = {
    x: null, //当前鼠标x
    y: null, //当前鼠标y
    max: 20000 // 圈半径的平方
  };

  const frame_func = window.requestAnimationFrame 
                || window.webkitRequestAnimationFrame 
                || window.mozRequestAnimationFrame 
                || window.oRequestAnimationFrame 
                || window.msRequestAnimationFrame 
                || function (callback) {
                        window.setTimeout(callback, 1000 / 40);
                    };
  const random = Math.random;

  const DEFAULT_CONFIG = {
    zIndex: -1,
    opacity: 0.8,
    color: particleColor.value,
    count: particleNum.value
  };

  // 包括当前鼠标所处位置的所有点的数组
  var all_array = [];
  // 所有点的数组
  var random_points = [];

  // 初始化画布
  the_canvas.id = canvas_id;
  the_canvas.style.cssText = 
      `postion: fixed;
        top: 0;
        left: 0;
        z-index:${DEFAULT_CONFIG.zIndex};
        opacity:${DEFAULT_CONFIG.opacity};
      `;
  
  // 设置画布尺寸
  const set_canvas_size = () => {
    canvas_width = the_canvas.width = window.innerWidth;
    canvas_height = the_canvas.height = window.innerHeight
  }
  // 初始化画布大小
  set_canvas_size();
  window.onresize = set_canvas_size;

  const draw_canvas = () => {
    context.clearRect(0, 0, the_canvas.width, the_canvas.height);

    var otherPoint, lineWidth, x_dist, y_dist, dist, e;
    // 逐点计算，绘制线条

    random_points.forEach( (item, index) => {
      // 移动，更新每个粒子的坐标
      item.x += item.xa;
      item.y += item.ya;
      // 碰到边界，速度反向
      (item.x > canvas_width || item.x < 0) && (item.xa = -item.xa);
      (item.y > canvas_height || item.y < 0) && (item.ya = -item.ya);
    
      // 在计算出的移动后的位置绘制一个宽高为1的点（实心矩形）
      // context.fillRect(item.x - 0.5, item.y - 0.5, 1, 1);
      context.fillRect(item.x - 1, item.y - 1, 2, 2);
    
      for (let i = index + 1; i < all_array.length; i++) {
        // 注意all_array比random_array多一个 current_point
        e = all_array[i];
     
        if (null !== e.x && null !== e.y) {
            x_dist = item.x - e.x; // x轴距离
            y_dist = item.y - e.y; // y轴距离
            dist = x_dist * x_dist + y_dist * y_dist; 
    
            dist < e.max && 
            (
              /**
               * 当某个点到当前鼠标的位置点 之间的距离
               *  小于 该点的最大吸附距离max 且 大于 max/2 时
               * 执行加速，并且利用横纵坐标的等比例减小，
               * 使得实现了粒子向着鼠标直接运动，形成“吸附”的感觉
               */
              e === current_point && 
              dist >= e.max / 2 && 
              (
                item.x -= 0.03 * x_dist, 
                item.y -= 0.03 * y_dist
              ),
              lineWidth = (e.max - dist) / e.max,
              // 设置开始路径
              context.beginPath(),
              // 设置线条的宽度，两点距离越近，线越粗
              // context.lineWidth = lineWidth / 2,
              context.lineWidth = lineWidth,
              // 设置线条的颜色
              context.strokeStyle = lineColor.value,
              // 设置绘制的起始点
              context.moveTo(item.x, item.y),
              // 设置经过某个位置
              context.lineTo(e.x, e.y),
              // 关闭画笔
              context.stroke()
            );
        }
      }
    });

    frame_func(draw_canvas);
  }

  const canvas_container = document.querySelector("#canvas-container");
  canvas_container.appendChild(the_canvas);
  // 当时鼠标位置存储，离开的时候，释放当前位置信息
  // (如果只希望鼠标放在canvas上面才触发，就使用canvas.onmousemove, 否则是window.onmousemove)
  window.onmousemove = function (e) {
      e = e || window.event;
      current_point.x = e.clientX;
      current_point.y = e.clientY;
  }, window.onmouseout = function () {
      current_point.x = null;
      current_point.y = null;
  }; 

  // 随机生成 DEFAULT_CONFIG.count 个点的位置信息
  for (var i = 0; DEFAULT_CONFIG.count > i; i++) {
        //随机位置
    var x = random() * canvas_width, 
        y = random() * canvas_height,
        //随机运动速度（方向+大小）
        xa = 2 * random() - 1, 
        ya = 2 * random() - 1;
    // 随机点
    random_points.push({
        x: x,
        y: y,
        xa: xa,
        ya: ya,
        max: 6000 //沾附距离
    });
  }

  all_array = random_points.concat([current_point]);

  //0.1秒后绘制
  setTimeout(function () {
    draw_canvas();
  }, 100);
});

</script>

<style scoped>
#canvas-container{
  position: fixed;
  left: 0;
  top: 0;
  z-index: -10;
  width:100%;
  height:100%;
  box-sizing: border-box;
  /* background-color: rgb(245,247,249); */
  background-color:  v-bind(backgroundColor);
}
</style>