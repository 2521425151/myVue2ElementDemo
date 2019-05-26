import RConfig from 'axios'
RConfig.defaults={
    timeout:50000,
    baseURL:'api/rConfig',
    headers:{
        post:{"Content-Type":'application/x-www-form-urlencoded'},
        common:{'Authorization':'授权token'}
    }
};

// 请求前拦截器
RConfig.interceptors.request.use(
    config=>{

    },
    error=>{

    }
);
// 请求后拦截器
