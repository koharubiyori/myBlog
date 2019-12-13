import { get, post } from '~/utils/fetch'
import { Api } from './tag.d'

export default {
  getAll: get<undefined, ApiData.Tag[]>('tag/getAll'),

  set: post<Api.Set, { tagId: string }>('tag/set', { loading: true, fail: true }),

  delete: post<Api.Delete>('tag/delete', { loading: true, fail: true })
}