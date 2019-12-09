import { get, post } from '~/utils/fetch'
import { Api } from './user.d'


export default {
  getRegisterSecurityCode: get<undefined, { svg: string }>('user/getRegisterSecurityCode'),
  
  register: post<Api.Register>('user/register', { loading: true, fail: true }),
  
  login: post<Api.Login, ApiData.User>('user/login', { loading: true, fail: true }),
  
  getUserInfo: get<undefined, ApiData.User>('user/getUserInfo'),

  uploadAvatar: post<{ file: File }, { fileUrl: string }>('user/uploadAvatar', { upload: true })
}