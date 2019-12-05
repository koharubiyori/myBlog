import { AxiosRequestConfig } from 'axios'
import request from './request'

type CreateRequester = 
  (method: AxiosRequestConfig['method']) => 
    <RequestParams, ApiData = {}>(url: string) => 
      (params: RequestParams) => Promise<ApiData | ResponseData<ApiData> | undefined>

const createRequester: CreateRequester = (method) => <RequestParams, ApiData = {}>(url: string) =>{
  return (params: RequestParams) => new Promise((resolve: (val: ApiData) => void, reject: (val?: ResponseData<ApiData>) => void) =>{
    request({ method, url, params })
    .then(({ data }: { data: ResponseData<ApiData> }) =>{
      data.result ? resolve(data.data as ApiData) : reject(data)
    }).catch(e =>{
      console.log(e)
      reject()
    })
  })
}

export const get = createRequester('get')
export const post = createRequester('post')





