import axios from 'axios'


// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://localhost', // API 的基础URL
  timeout: 100000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在这里可以添加token等认证信息
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // if (res.code === 200) {
    //   return res
    // } else {
    //   return Promise.reject(new Error(res.msg || '请求失败'))
    // }
    return res
  }

  
  
)

export default service 