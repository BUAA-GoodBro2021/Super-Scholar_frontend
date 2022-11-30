import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
export const useSearchStore = defineStore({
  id: "search",
  state: () => {
    return {
      // 搜索框的文本
      searchInputText: useLocalStorage("token", "", localStorage),
      // 对应于用户的搜索历史，是一个 String 类型的数组
      historyList: useLocalStorage("historyList", ["1", "2", "3", "4"], localStorage)
    }
  },
  actions: {
    /**
     * 改变当前搜索框的文本
     */
    setSearchInputText(newSearchInputText){
      this.searchInputText = newSearchInputText;
    },
    /**
		 * 新增
		 * 1.新增的历史记录位于头部
		 * 2.不可出现重复的记录
		 */
    addHistory(newHistory) {
      const index = this.historyList.findIndex(
        (item) => item === newHistory
      );
      // 剔除旧数据
      if (index !== -1) {
        this.historyList.splice(index, 1);
      }
      // 新增记录
      this.historyList.unshift(newHistory);
    },
    /**
		 * 删除单个历史
		 */
		deleteHistory(index) {
			this.historyList.splice(index, 1);
		},
    /**
		 * 全部删除历史
		 */
		deleteAllHistory() {
			this.historyList = [];
		}
  }
});