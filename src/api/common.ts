import { get, post } from '~/utils/fetch'
import { Api } from './common.d'

export default {
  getTheme: get<undefined, ApiData.Theme>('common/getTheme')
}