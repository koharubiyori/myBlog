import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import createUploadToken from './createUploadToken'

const DEV_URL = '/api'
const PRO_URL = 'https://api.koharu.top/blog'

const IMG_URL = 'https://img.koharu.top/upload/blog'

const config: AxiosRequestConfig = {
  baseURL: process.env.NODE_ENV === 'development' ? DEV_URL : PRO_URL,
  // baseURL: PRO_URL,
  timeout: 10000,
  withCredentials: true
}

const axiosInstance = axios.create(config)

axiosInstance.interceptors.request.use(requestDataHandler)
axiosInstance.interceptors.response.use(responseDataHandler)

// 请求拦截器
function requestDataHandler(req: AxiosRequestConfig){  
  if(!req.params) req.params = {}
  if(req.method === 'post'){
    req.data = req.params
    delete req.params
  }

  if(req.headers.upload === 1){
    let formData = new FormData()
    for(let key in req.data){
      formData.append(key, req.data[key])
    }

    req.baseURL = IMG_URL
    delete req.headers.upload
    req.headers.token = createUploadToken()
    req.data = formData
    req.timeout = 20000
  }

  return req
}

// 响应拦截器
function responseDataHandler(res: AxiosResponse){

  return res
}

export default axiosInstance