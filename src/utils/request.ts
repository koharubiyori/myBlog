import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export const prodApi = ''

const config: AxiosRequestConfig = {
  baseURL: process.env.NODE_ENV === 'production' ? prodApi : '/',
  timeout: 10000,
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

    req.data = formData
  }

  return req
}

// 响应拦截器
function responseDataHandler(res: AxiosResponse){

  return res
}

export default axiosInstance