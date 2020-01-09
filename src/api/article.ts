import { get, post } from '~/utils/fetch'
import { Api } from './article.d'

export default {
  get: get<Api.Get, ApiData.Article>('article/get', { loading: true, fail: true }),

  search: get<Api.Search, PageData<ApiData.SearchResult>>('article/search', { loading: true, fail: true }),

  searchByTag: get<Api.SearchByTag, PageData<ApiData.SearchResult>>('article/searchByTag', { loading: true, fail: true }),

  searchTop: get<undefined, ApiData.SearchResult[]>('article/searchTop', { loading: true, fail: true }),

  searchRandom: get<undefined, ApiData.SearchResult[]>('article/searchRandom', { loading: true, fail: true }),

  searchHot: get<undefined, ApiData.SearchResult[]>('article/searchHot', { loading: true, fail: true }),

  searchByUserCollect: get<Api.SearchByUserCollect, PageData<ApiData.SearchResult>>('article/searchByUserCollect', { loading: true, fail: true }),

  getCollectStatus: get<Api.GetCollectStatus, { collectStatus: boolean }>('article/getCollectStatus'),

  publish: post<Api.Publish>('article/publish', { loading: true, fail: true }),

  delete: post<Api.Delete>('article/delete', { loading: true, fail: true }),
  
  setCollectStatus: post<Api.SetCollectStatus>('article/setCollectStatus', { loading: true, fail: true }),

  uploadImg: post<{ file: File }, { fileUrl: string }>('article/uploadImg', { loading: true, fail: '图片上传失败，请重试', upload: true }),

  uploadHeadImg: post<{ file: File }, { fileUrl: string }>('article/uploadHeadImg', { loading: true, fail: '图片上传失败，请重试', upload: true })
}