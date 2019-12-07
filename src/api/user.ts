import { get, post } from '~/utils/fetch'
import { Api } from './user.d'


export default {
  getRegisterSecurityCode: get<undefined, { svg: string }>('user/getRegisterSecurityCode'),
  register: post<Api.Register>('user/register'),
  login: post<Api.Login, ApiData.User>('user/login'),
}