import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { Search } from "../api/search";
export const useSearchStore = defineStore({
  id: "search",
  state: () => {
    return {
      // 进行搜索的类型（五大实体）这里默认为论文，并且做持久化处理
      // works authors venues institutions concepts
      // TODO 可以考虑做一个字段限制检查，不是这5个的话报错
      searchType: useLocalStorage("searchType", "works", localStorage),
      // 搜索框的文本，需要做持久化处理
      searchInputText: useLocalStorage("searchInputText", "", localStorage),
      // 对应于用户的搜索历史，是一个 String 类型的数组
      historyList: useLocalStorage("historyList", [], localStorage),
      // 搜索结果排序类型
      sortType: useLocalStorage("sortType", "Relevance", localStorage),
    }
  },
  actions: {
    /**
     * 改变当前搜索框的搜索类型
     */
    setSearchType(newSearchType) {
      this.searchType = newSearchType;
    },
    /**
     * 改变当前搜索框的文本
     */
    setSearchInputText(newSearchInputText) {
      this.searchInputText = newSearchInputText;
    },
    /**
     * 设置历史记录
     */
    setSearchHistory(newSearchHistoryArray) {
      this.historyList = newSearchHistoryArray;
    },
    /**
		 * 新增单条历史记录
     * >>> 用户登录时获取到和改用户绑定的历史记录
     * 遍历一次数组逐个加入即可
     * >>> 用户输入搜索文本后完成一次搜索
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
      // 将新的历史记录更新至后端
      Search.postSearchHistory({
        "history_list": this.historyList
      });
    },
    /**
		 * 删除单个历史
		 */
		deleteHistory(index) {
			this.historyList.splice(index, 1);
      // 将新的历史记录更新至后端
      Search.postSearchHistory({
        "history_list": this.historyList
      });
		},
    /**
		 * 全部删除历史
		 */
		deleteAllHistory() {
			this.historyList = [];
      // 将新的历史记录更新至后端
      Search.postSearchHistory({
        "history_list": this.historyList
      });
		},
    /**
     * 改变排序类型
     */
    setSortType(newSortType) {
      this.sortType = newSortType;
    }
  }
});