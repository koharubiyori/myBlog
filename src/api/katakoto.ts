import { get, post } from '~/utils/fetch'
import { Api } from './katakoto.d'

export default {
  load: get<Api.Load>('katakoto/load'),

  add: post<Api.Add>('katakoto/post'),

  delete: post<Api.Delete>('katakoto/delete')
}