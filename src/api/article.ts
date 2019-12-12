import { get, post } from '~/utils/fetch'
import { Api } from './article.d'

export default {
  get: get<Api.Get, ApiData.Article>('article/get', { loading: true, fail: true }),

  search: get<Api.Search, PageData<ApiData.Article>>('article/search', { loading: true, fail: true }),

  publish: post<Api.Publish>('article/publish', { upload: true }),

  delete: post<Api.Delete>('article/delete', { loading: true, fail: true }),
  
  setCollectStatus: post<Api.SetCollectStatus>('article/setCollectStatus'),

  uploadImg: post<{ file: File }, { fileUrl: string }>('article/uploadImg', { upload: true }),

  uploadHeadImg: post<{ file: File }, { fileUrl: string }>('article/uploadHeadImg', { upload: true })
}