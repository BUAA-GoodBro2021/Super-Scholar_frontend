import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core';
export const useGlobalStore = defineStore({
  id: "GlobalState",
  state: () => {
    return {
      token: useLocalStorage("token", "", localStorage),
      userInfo: useLocalStorage("userInfo", {}, localStorage),
      language: useLocalStorage("language", "zh", localStorage),
    }
  },
  getters: {
    isAdmin(state){
      return state.userInfo.is_super;
    },
    isAuth(state){
      return state.token.length > 0;
    },
    claimStatus(state) {
      return state.userInfo.is_professional
    }
  },
  actions: {
    setToken(token) {
      this.token = token;
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    updateLanguage(language) {
      this.language = language;
    },
  },
})