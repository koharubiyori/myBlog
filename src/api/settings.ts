import { get, post } from '~/utils/fetch'
import { Api } from './settings.d'

export default {
  get: get<undefined, ApiData.Settings>('settings/get', { loading: true, fail: true }),

  set: post<Api.Set>('settings/set', { loading: true, fail: true }),

  uploadBgImg: post<{ file: File }, { fileUrl: string }>('settings/uploadBgImg', { upload: true, loading: true })
}