import { get, post } from '~/utils/fetch'
import { Api } from './common.d'

export default {
  getTheme: get<undefined, ApiData.Theme>('common/getTheme'),
  upload: post<{ file: File }, { fileUrl: string }>('', { loading: true, fail: '图片上传失败，请重试', upload: true })
}