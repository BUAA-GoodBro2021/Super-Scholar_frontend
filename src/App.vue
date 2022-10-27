<template>
   <el-config-provider :locale="i18nLocale" :button="noSpace">
    <router-view></router-view>
   </el-config-provider>
</template>
<script setup>
import { useGlobalStore} from "./stores/global.js";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
const globalStore = useGlobalStore();
// 配置element按钮文字中间是否有空格
const noSpace = reactive({
   autoInsertSpace: false,
})
// element 语言配置
const i18nLocale = computed(() => {
	if (globalStore.language && globalStore.language == "zh") return zhCn;
	if (globalStore.language == "en") return en;
	return {};
});
</script>
<style>
</style>