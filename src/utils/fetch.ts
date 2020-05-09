import { AxiosRequestConfig } from 'axios'
import request from './request'
import nProgress from 'nprogress'
import getNotify from '~/externalContexts/notify'

interface RequesterOptions {
  loading?: boolean
  fail?: boolean | string
  upload?: boolean
}

type CreateRequester = 
  (method: AxiosRequestConfig['method']) => 
    <RequestParams, ApiData = {}>(url: string, options?: RequesterOptions) => 
      (params?: RequestParams, options?: RequesterOptions) => Promise<ApiData>

const createRequester: CreateRequester = (method) => <RequestParams, ApiData = {}>(url: string, options?: RequesterOptions) =>{
  let {loading, fail, upload} = options || {}

  return (params?: RequestParams, options?: RequesterOptions): Promise<ApiData> => new Promise((resolve, reject) =>{
    if(options){
      if('loading' in options) loading = options.loading
      if('fail' in options) fail = options.fail
      if('upload' in options) upload = options.upload
    }

    loading && nProgress.start()
    request({ method, url, params,
      ...(upload ? { headers: { upload: 1 } } : {})
    })
      .finally(nProgress.done)
      .then(({ data }: { data: ResponseData<ApiData> }) =>{
        if(data.result){
          resolve(data.data)
        }else{
          reject(data)
          fail && getNotify()(data.message)
        }
      }).catch(e =>{
        console.log(e)
        reject()
        fail && getNotify()(typeof fail === 'string' ? fail : '网络错误')
      })
  })
}

export const get = createRequester('get')
export const post = createRequester('post')





