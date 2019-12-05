import { get, post } from '~/utils/fetch'

export default {
  register: post<{}>('user/register')
}