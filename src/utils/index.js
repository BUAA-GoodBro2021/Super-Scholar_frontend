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