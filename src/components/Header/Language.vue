<template>
   <el-dropdown trigger="click" @command="handleSetLanguage">
      <svg t="1668442914617" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2176" width="200" height="200"><path d="M881.4 960H236V64h645.4c46.3 0 78.6 36.2 78.6 88v720c0 51.8-32.3 88-78.6 88zM300 896h581.4c6.1 0 8.1-2 9.6-3.9 3.2-4.2 5.1-11.5 5.1-20.1V152c0-8.6-1.9-15.9-5.1-20.1-1.5-1.9-3.5-3.9-9.6-3.9H300v768z" fill="#727272" p-id="2177"></path><path d="M806 638h-66l-47.2-104.6H500.4L456 638h-66l176.1-382H630l176 382zM674.4 490.3l-69.8-158.8c-2.2-5.1-4.6-14-7.2-26.6h-1.5c-2.2 11.5-4.7 20.4-7.5 26.6l-69.2 158.8h155.2z" fill="#E6C37C" p-id="2178"></path><path d="M390 704h416v64H390zM128.2 960C97.9 960 64 935.4 64 905.2V118.8c0-30.2 24.6-54.2 54.9-54.2L170 64v896h-41.8z" fill="#727272" p-id="2179"></path></svg>
      <template #dropdown>
         <el-dropdown-item :disabled="language && language === 'zh'" command="zh">
                     简体中文
         </el-dropdown-item>
         <el-dropdown-item :disabled="language === 'en'" command="en">
                     English
         </el-dropdown-item>
      </template>
   </el-dropdown>
</template>
<script setup>
import { useI18n } from "vue-i18n";
import { useGlobalStore } from "../../stores/global.js";
import { getBrowserLang } from "../../utils/index.js"
// 语言切换
const i18n = useI18n();
const globalStore = useGlobalStore();
const language = computed(()=>globalStore.language);
const handleSetLanguage = (lang) => {
	i18n.locale.value = lang;
	globalStore.updateLanguage(lang);
};
onMounted(() => {
	handleSetLanguage(language.value || getBrowserLang());
});
</script>
<style scoped>
.icon{
   width: 38px;
   height: 38px;
   margin-top: 12px;
}
</style>