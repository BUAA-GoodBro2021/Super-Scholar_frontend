<template>
    <div class="wrap">
        <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="引用量" name="countByYear">
                <div class="count" id="count"></div>
            </el-tab-pane>
            <el-tab-pane label="专家关系网络" name="authorNetWork">
                <div class="network" id="network"></div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
const props = defineProps({
    dataCountByYear: Object,
    authorNetWork: Object,
})
const activeName = ref('countByYear')

const handleClick = () => {
    console.log('click');
}

OnMounted(() => {
    //处理documentList 将publication_year与publication_date连接起来
})

</script>
<style>
.wrap{
    height: 100%;
    width: 100%;
}
.count{
    height: 100%;
    width: 100%;
}
.authorNetWork{
    height: 100%;
    width: 100%;
}
</style>