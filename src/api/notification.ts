import { get, post } from '~/utils/fetch'
import { Api } from './notification.d'

export default {
  load: get<Api.Load, ApiData.Notification[] | PageData<ApiData.Notification>>('/notification/load', { loading: true, fail: true }),

  check: post<Api.Check>('/notification/check', { loading: true, fail: true }),
}