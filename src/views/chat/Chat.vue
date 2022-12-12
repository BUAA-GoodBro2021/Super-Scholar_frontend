<template>
    <div class="clearfix" style="height: 100vh;">
    <Header style="height:64px"/>
      <div class="chat-container">
        <div class="chat-header">
          <h3>ChatGPT App</h3>
        </div>
        <div class="chat-responses">
          <div v-for="response in responses" :key="response.id">
            <p class="chat-response" :class="{ 'chat-response-user': response.username === 'ChatGPT' }">
              <span v-html="response.text"></span>
            </p>
          </div>
        </div>
        <div class="chat-input">
          <input
            v-model="newRequest"
            :disabled="sending"
            @keydown.enter="sendRequest"
            placeholder="Enter"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { Configuration, OpenAIApi } from 'openai';
  
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  
  export default {
    setup() {
      const responses = ref([
        {
          id: Date.now(),
          username: 'ChatGPT',
          text: '您好,我是ChatGPT,请问我能为你提供什么帮助?',
        },
      ]);
  
      const newRequest = ref('');
      const sending = ref(false);
  
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
  
        responses.value.push({
          username: 'ChatGPT',
          text: completion.data.choices[0].text,
        });
  
        sending.value = false;
      };
  
      return {
        responses,
        newRequest,
        sendRequest,
        sending,
      };
    },
  };
  </script>
  
  <style lang="scss">
  .clearfix::before,
    .clearfix::after {
    content: '';
    display: table;
    clear: both;
    }
  .chat-container {
    margin-top: 64px;
    height: calc(100vh - 64px);
    overflow-x: hidden;
    width: 100vw;
  }
  
  .chat-header {
    background-color: #f5f5f5;
    height: 50px;
    text-align: center;
  }
  
  h3 {
    line-height: 50px;
    margin: 0;
  }
  
  .chat-responses {
    height: calc(100vh - 180px);
    overflow-y: scroll;
    padding: 10px;
  }
  
  .chat-response {
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 4px;
  }
  
  .chat-input {
    width: 100vw;
    padding: 0;
  }
  
  .chat-header {
    background-color: #333;
    color: #fff;
  }
  
  .chat-response-user {
    background-color: #333;
    color: #fff;
  }
  
  .chat-input {
    width: 100%;
  }
  
  .chat-input input {
    width: 100%;
    height: 36px;
    box-sizing: border-box;
  }
  </style>
  