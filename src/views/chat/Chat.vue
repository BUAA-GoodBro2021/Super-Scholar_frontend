<template>
  <div class="clearfix" style="height: 100vh;">
    <Header style="height:64px" />
    <div class="chat-container">
      <div class="chat-responses">
        <SandboxLoading v-if="sending"/>
        <div v-for="response in responses" :key="response.id" ref="chatRoom">
          <div class="chat-response">
            <div v-if="response.username === 'ChatGPT'" class="chat-response-GPT">
              <img :src="GPTUrl" width="40" class="chat-avatar"/>
              <div class="chat-index">
                <div v-html="response.text">
              </div>
              </div>
            </div>
            <div v-else class="chat-response-user" >
              <img :src="circleUrl" width="40" class="chat-avatar"/>
              <div class="chat-index">
                <div v-html="response.text">
                </div>
              </div>
            </div>
            <div ref="chatBottom">
            </div>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <el-input v-model="newRequest" @keydown.enter="sendRequest" placeholder="基于chatGPT,您忠实的学术助手">
        </el-input>
        <div class="chat-button" @click="sendRequest">
          <el-icon style="width: 50px;height:50px;">
              <Promotion />
            </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { Configuration, OpenAIApi } from 'openai';
import hljs from "highlight.js";
import { marked } from "marked";
import { useGlobalStore } from '../../stores/global.js';
import GPTUrl from "../../assets/images/chat.png"
import "highlight.js/styles/atom-one-dark.css";
import SandboxLoading from '../../components/Loading/SandboxLoading.vue';
const configuration = new Configuration({
  apiKey: "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",
});
const globalStore = useGlobalStore();
const circleUrl = globalStore.userInfo.avatar_url;
const openai = new OpenAIApi(configuration);
const responses = ref([
  {
    id: Date.now(),
    username: 'ChatGPT',
    text: `你好呀，我是Super Scholar 学术AI小助手，有什么学术领域上的问题，可以随时询问我哦！比如:<br/>
    深度学习领域最有影响力的论文是哪些，并给出对应网址。<br/>
    计算机视觉领域知名学者有哪些，他们有哪些代表作品？<br/>`,
  },
]);
const chatRoom = ref();
watch(responses,()=>{
  let len = chatRoom.value.length
  // 使用nextTick确保获取到新渲染内容
  nextTick(() => {
    chatRoom.value[len-1].scrollIntoView()
  })
},{
  deep: true,
})
const newRequest = ref('');
const sending = ref(false);
const chatBottom = ref();
let render = new marked.Renderer();
marked.setOptions({
  renderer: render, // 这是必填项
  gfm: true,	// 启动类似于Github样式的Markdown语法
  pedantic: false, // 只解析符合Markdwon定义的，不修正Markdown的错误
  // 高亮的语法规范
  highlight: (code, lang) => hljs.highlight(code, { language: lang }).value,
})
const sendRequest = async () => {
  if (!newRequest.value) return;
  sending.value = true;
  responses.value.push({
    id: Date.now(),
    username: 'Person',
    text: newRequest.value,
  });
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: newRequest.value,
    temperature: 0.7,
    max_tokens: 4000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  newRequest.value = '';
  let temp = completion.data.choices[0].text;
  try {
    temp = marked.parse(completion.data.choices[0].text);
  } catch (error) {
    console.error(error);
  }
  temp.replace(/\n/g, '<br/>');
  responses.value.push({
    username: 'ChatGPT',
    text: temp,
  });

  sending.value = false;
};
</script>
  
<style lang="scss" scoped>
.clearfix::before,
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
.avatar{
  display: inline-block;
}
.chat-responses::-webkit-scrollbar {
width: 8px;
height: 8px;
}
/* ::-webkit-scrollbar-corner 边角 */
.chat-responses::-webkit-scrollbar-corner {
background-color: initial;
}
/* ::-webkit-scrollbar-thumb 滚动条里面可以拖动的那个 */
.chat-responses::-webkit-scrollbar-thumb {
background-color: transparent !important;
border-radius: 10px;
}
/* ::-webkit-scrollbar-track 外层轨道 */
.chat-responses::-webkit-scrollbar-track {
background-color: transparent !important;
}
.chat-container {
  margin-top: 64px;
  height: calc(100vh - 64px);
  overflow-x: hidden;
  width: 100vw;
  position: relative;
}

.chat-responses {
  height: calc(80vh - 64px);
  overflow-y: auto;
}

.chat-response {
  text-align: center;
  min-height: 3rem;
  position: relative;
}

.chat-response-GPT {
  padding: 2rem;
  background-color: #f7f7f7;
  width: 100%;
  line-height: 1rem ;
  font-size: 1rem;
}
.chat-response-user{
  padding: 2rem;
  background-color: white;
  width: 100%;
  line-height: 1rem ;
  font-size: 1rem;
  font-weight: 600;
}
.chat-index{
  line-height: 1.5rem;
  margin-top: 1rem;
  text-align: left;
}
.chat-input {
  position: absolute;
  width: 80% !important;
  left: 10%;
  bottom: calc(10% - 20px);
  padding: 0;
  height: 50px;
  .el-input{
    height:100%;
  }
  .chat-button{
  position: absolute;
  top:0;
  right: 0;
  bottom: calc(10% - 20px);
  height: 50px;
  width: 50px;
  background-color: #f7f7f7;
}
}

.chat-avatar{
  position: relative;
  right:calc(50% - 20px);
}
</style>
  