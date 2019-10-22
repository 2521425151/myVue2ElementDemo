import networkRequest from 'axios'

export const NRequest = networkRequest.create({
	baseURL:'./',
	timeout: 1000*60*5,
	headers:{
		common:{
			'X-Requested-With': 'XMLHttpRequest',
		},
		post:{
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}
});
// 请求拦截器-请求前
NRequest.interceptors.request.use(function(config){
	return config
},function(error){
	return Promise.reject(error)
})

// 请求拦截器-请求后
NRequest.interceptors.request.use(function(res){
	return res
},function(error){
	return Promise.reject(error)
})



