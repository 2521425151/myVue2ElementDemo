/**
 * @深拷贝
 * */
export function deepCopy(data) {
	return JSON.parse(JSON.stringify(data));
}
/**
 *@下划线转驼峰
 *@string 需要处理的字符串
 * */
export function toHump(string) {
	return string.replace(/_(\w)/g,function(all,letter){ return letter.toUpperCase() })
}

/**
 *@驼峰转下划线
 *@string 需要处理的字符串
 * */
export function toLine(string) {
	return string.replace(/([A-Z])/g,"_$1").toLowerCase();
}

/**
 * @日期格式化
 * @fmt string yyyy-MM-dd hh:mm:ss
 * */
window.Date.prototype.Format = function (fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1,                 //月份
		"d+": this.getDate(),                    //日
		"h+": this.getHours(),                   //小时
		"m+": this.getMinutes(),                 //分
		"s+": this.getSeconds(),                 //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds()             //毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

/**
 * @把window.location的参数处理成一个对象
 * @query string http://...
 * */

export function parseUrlParams(query) {
	if (query) return "";
	let info = query.split('?')[1];
	let result = {};
	info.split('&').forEach(item => {
		result[decodeURIComponent(item.split('=')[0])] = decodeURIComponent(item.split('=')[1]);
	});
	return result;
}

/**
 * @转成千分位-保留两位
 * */
export function addSeparator(n) {
	let num = Number(n);
	let re = /\d{1,3}(?=(\d{3})+$)/g;
	let n1 = num.toFixed(2).replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
		return s1.replace(re, "$&,") + s2;
	});
	return n1;
}

/**
 * @去除千分位
 * */
export function deleteSeparator(num) {
	if (num) {
		let numS = num;
		numS = numS.toString();
		numS = numS.replace(/,/gi, '');
		return numS;
	} else {
		return num;
	}
}

/**
 * @防抖
 * @fn Function 需要执行的函数
 * @delay Number 间隔的毫秒数
 * */
export function throttle (fn, delay = 200) {
	let timer = ''
	return function () {
		const th = this
		const args = arguments
		if (timer) { clearTimeout(timer) }
		timer = setTimeout(function () {
			timer = ''
			fn.apply(th, args)
		}, delay)
	}
}

/**
 * @节流
 * @fn Function 需要执行的函数
 * @interval
 * */
export function stabilization (fn, interval = 200) {
	let last = new Date().getTime()
	let timer
	return function () {
		const th = this
		const args = arguments
		const now = new Date().getTime()
		if (last && now - last < interval) {
			clearTimeout(timer)
			timer = setTimeout(function () {
				last = new Date().getTime()
				fn.apply(th, args)
			}, interval)
		} else {
			last = new Date().getTime()
			fn.apply(th, args)
		}
	}
}

/**
 * @获取某月的第一天或者最后一天
 * */
export function startAndEnd (thatDay, dateTime) {
	if (!dateTime) { return '' }
	const dateT = new Date(dateTime)
	const y = dateT.getFullYear()
	const m = dateT.getMonth()
	if (thatDay === 'start') { // 返回第一天
		return new Date(y, m, 1).Format('yyyyMM')
		// return new Date(y, m, 1).toLocaleDateString()
	} else if (thatDay === 'end') { // 返回最后一天
		return new Date(y, m + 1, 0).Format('yyyyMM')
		// return new Date(y, m + 1, 0).toLocaleDateString()
	}
}
