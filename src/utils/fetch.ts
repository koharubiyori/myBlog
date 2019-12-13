import { AxiosRequestConfig } from 'axios'
import request from './request'
import nProgress from 'nprogress'

interface RequesterOptions {
  loading?: boolean
  fail?: boolean
  upload?: boolean
}

type CreateRequester = 
  (method: AxiosRequestConfig['method']) => 
    <RequestParams, ApiData = {}>(url: string, options?: RequesterOptions) => 
      (params?: RequestParams, options?: RequesterOptions) => Promise<ApiData>

const createRequester: CreateRequester = (method) => <RequestParams, ApiData = {}>(url: string, options?: RequesterOptions) =>{
  let {loading, fail, upload = false} = options || {}

  return (params?: RequestParams, options?: RequesterOptions): Promise<ApiData> => new Promise((resolve, reject) =>{
    if(options){
      if(options.loading) loading = options.loading
      if(options.fail) fail = options.fail
    }

    loading && nProgress.start()
    request({ method, url, params,
      ...(upload ? { headers: { upload: 1 } } : {})
    })
      .finally(nProgress.done)
      .then(({ data }: { data: ResponseData<ApiData> }) =>{
        if(data.result){
          resolve(data.data as ApiData)
        }else{
          reject(data)
          fail && $notify(data.message)
        }
      }).catch(e =>{
        console.log(e)
        reject()
        fail && $notify('网络错误')
      })
  })
}

export const get = createRequester('get')
export const post = createRequester('post')





