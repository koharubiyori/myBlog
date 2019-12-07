import { get, post } from '~/utils/fetch'

export default {
  getTheme: get<undefined, ApiData.Theme>('/common/getTheme')
}