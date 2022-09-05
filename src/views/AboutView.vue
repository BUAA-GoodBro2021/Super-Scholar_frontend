<template>
  <div class="about">
    <el-button type="primary">{{x}},{{y}}</el-button>
  </div>
</template>
<script setup>
  const {x,y} = useMouse();
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
