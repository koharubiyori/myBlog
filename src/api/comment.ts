import { get, post } from '~/utils/fetch'
import { Api } from './comment.d'

export default {
  get: get<Api.Get, ApiData.Comment[]>('comment/get'),

  post: post<Api.Post, { commentId: string }>('comment/post', { loading: true, fail: true }),

  delete: post<Api.Delete>('comment/delete', { loading: true, fail: true })
}