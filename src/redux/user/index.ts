import { ReduxReducer } from '~/@types/types'
import Cookies from 'js-cookie'

export const SET = Symbol()
export const CLEAR = Symbol()

export interface ConnectedState extends ApiData.User {

}

const init = () => ({
  _id: '',
  name: '',
  account: '',
  avatar: '',
  deleted: false,
})

const reducer: ReduxReducer<ConnectedState> = (state: ApiData.User = init(), action) =>{
  switch(action.type){
    case SET: {
      return { ...state, ...action.data }
    }

    case CLEAR: {
      Cookies.remove('userToken')
      return init()
    }

    default: {
      return state
    }
  }
}

export default reducer