import { get, post } from '~/utils/fetch'
import { Api } from './katakoto.d'

export default {
  load: get<Api.Load, PageData<ApiData.Katakoto>>('katakoto/load'),

  add: post<Api.Add>('katakoto/add'),

  delete: post<Api.Delete>('katakoto/delete')
}