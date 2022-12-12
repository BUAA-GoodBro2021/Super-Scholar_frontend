<template>
  <div class="display" style="font-size: 16px;">
    <div class="container">
      <div class="cube">
        <div class="sides">
          <div class="top"></div>
          <div class="right"></div>
          <div class="bottom"></div>
          <div class="left"></div>
          <div class="front"></div>
          <div class="back"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
div {
  display: block;
}

.display {
  width: 100vw;
  height: 100vh;
  position: fixed;
  border: 1px solid black;
  top: 0;
  left: 0;
  z-index: 9999;
  color: #fff;
  font-family: 'Inter', sans-serif;
  background: rgba(255, 255, 255, 0.6);
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.cube,
.cube * {
  position: absolute;
  /* width: 6rem; */
  /* height: 6rem; */
  width: 96px;
  height: 96px;
}

.cube {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.sides {
  /* animation: name duration timing-function delay iteration-count direction fill-mode; */
  animation: rotate 3s ease 0.8s infinite;
  transform-style: preserve-3d;
  transform: rotateX(-37.5deg) rotateY(45deg);
}

@keyframes rotate {
  0% {
    transform: rotateX(-37.5deg) rotateY(45deg);
  }

  50% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }

  100% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
}

.cube .sides * {
  box-sizing: border-box;
  /* border: 0.12rem solid white; */
  /* border: 1.92px solid white; */
  border: 1.92px solid black;
  /* border-radius: 0.25rem; */
  border-radius: 4px;
  /* background-color: rgba(255, 255, 255, 0.1); */
  background-color: rgba(0, 0, 0, 0.1);
}

/* 注意这里的<transform-function>的三个轴是基于父元素sides平面 */
.cube .sides .top {
  animation: top-animation 3s ease 0ms infinite forwards;
  transform: rotateX(90deg) translateZ(96px);
  transform-origin: 50% 50%;
}

@keyframes top-animation {
  0% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }

  20% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(48px);
  }

  70% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(48px);
  }

  90% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }

  100% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }
}

.cube .sides .right {
  animation: right-animation 3s ease 100ms infinite forwards;
  transform: rotateY(90deg) translateZ(96px);
  transform-origin: 50% 50%;
}

@keyframes right-animation {
  0% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(96px);
  }

  20% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(48px);
  }

  70% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(48px);
  }

  90% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(96px);
  }

  100% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(96px);
  }
}

.cube .sides .bottom {
  animation: bottom-animation 3s ease 0ms infinite forwards;
  transform: rotateX(-90deg) translateZ(96px);
  transform-origin: 50% 50%;
}

@keyframes bottom-animation {
  0% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }

  20% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(48px);
  }

  70% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(48px);
  }

  90% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }

  100% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }
}

.cube .sides .left {
  animation: left-animation 3s ease 100ms infinite forwards;
  transform: rotateY(-90deg) translateZ(96px);
  transform-origin: 50% 50%;
}

@keyframes left-animation {
  0% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(96px);
  }

  20% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(48px);
  }

  70% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(48px);
  }

  90% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(96px);
  }

  100% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(96px);
  }
}

.cube .sides .front {
  animation: front-animation 3s ease 100ms infinite forwards;
  transform: rotateY(0deg) translateZ(96px);
  transform-origin: 50% 50%;
}

@keyframes front-animation {
  0% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(96px);
  }

  20% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(48px);
  }

  70% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(48px);
  }

  90% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(96px);
  }

  100% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(96px);
  }
}

.cube .sides .back {
  animation: back-animation 3s ease 100ms infinite forwards;
  transform: rotateY(-180deg) translateZ(96px);
  transform-origin: 50% 50%;
}

@keyframes back-animation {
  0% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(96px);
  }

  20% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(48px);
  }

  70% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(48px);
  }

  90% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(96px);
  }

  100% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(96px);
  }
}
</style>