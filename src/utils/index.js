import { useSearchStore } from '../stores/search.js';

/**
 * @description 获取当前时间
 * @return string
 */
export function getTimeState() {
	// 获取当前时间
	let timeNow = new Date();
	// 获取当前小时
	let hours = timeNow.getHours();
	// 判断当前时间段
    if (hours >= 0 && hours < 4) return `夜深了 🌛`;
	if (hours >= 4 && hours < 11) return `早上好 ⛅`;
	if (hours >= 11 && hours < 14) return `中午好 🌞`;
	if (hours >= 14 && hours < 18) return `下午好 🌞`;
	if (hours >= 18 && hours < 24) return `晚上好 🌛`;
}

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export function getBrowserLang() {
	let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
	let defaultBrowserLang = "";
	if (browserLang.toLowerCase() === "cn" || browserLang.toLowerCase() === "zh" || browserLang.toLowerCase() === "zh-cn") {
		defaultBrowserLang = "zh";
	} 
	else {
		defaultBrowserLang = "en";
	}
	return defaultBrowserLang;
}

/**
 * @description 标题匹配高亮，用v-html代替原有的内容
 * @return HTML string
 */
const searchStore = useSearchStore();
export function highlightText(text) {
  if (searchStore.searchInputText) {
    // 生成高亮标签
    const highlightStr = `<span style="background: #ffd255">${searchStore.searchInputText}</span>`
    // 构建正则表达式
    const regModelStr = escapeRegExp(searchStore.searchInputText);
    const reg = new RegExp(regModelStr, 'gi');
    // const reg = new RegExp(props.searchText, 'gi');
    // 从《显示文本中》找出与《用户输入文本相同的内容》，使用《高亮标签》进行替换
    return `<span style="
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;"
      >${text.replace(reg, highlightStr)}</span>`;
  }
	else {
		return text;
	}
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


/**
 * @description 数字千分位显示
 * @return string
 */
export function toThousands(num) {
	var num = (num || 0).toString(), result = '';
	while (num.length > 3) {
			result = ',' + num.slice(-3) + result;
			num = num.slice(0, num.length - 3);
	}
	if (num) { result = num + result; }
	return result;
}