const MyHttpServer = {}
import axios from 'axios'

//响应拦截
axios.interceptors.request.use(config=>{
    if (localStorage.myblogToken){
        config.headers.Authorization = localStorage.myblogToken;
    }
    return config;
},error => {
    return Promise.reject(error)
});

//请求拦截
axios.interceptors.response.use(response=>{
    return response;
},error => {
    // const {status} = error.response;
    // if(status==401){
    //     alert('tocken过期,请重新登陆')
    //     localStorage.removeItem("myblogToken")
    //     this.$router.push("/login");
    // }else{
    //     alert("这里有错误："+error.response.data);
    //
    // }

    return Promise.reject(error);
});

MyHttpServer.install = (Vue) =>{
    Vue.prototype.$http = axios
};

export default MyHttpServer
