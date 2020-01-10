import { connect } from 'react-redux'
import {
  SET, CLEAR,
  State
} from './index'
import store from '~/redux'
import user from '~/api/user'
import Cookies from 'js-cookie'

const { dispatch, getState } = store

export const set = (data: Partial<State>) => dispatch({ type: SET, data })
export const clear = () => dispatch({ type: CLEAR })

export const updateUserInfo = (): Promise<ApiData.User> => new Promise((resolve, reject) =>{
  if(Cookies.get('userToken')){
    user.getUserInfo()
      .then(data =>{
        set(data)
        resolve(data)
      })
      .catch(e =>{
        console.log(e)
        clear()
        reject()
      })
  }else{
    clear()
    reject()
  }
})

export const getRole = () =>{
  const {user} = getState()
  if(!user._id) return 'visitor'
  return user.isAdmin ? 'admin' : 'user'
}

interface ConnectedDispatch {
  '$user': {
    set: typeof set
    clear: typeof clear
    getRole: typeof getRole
  }
}

export type UserConnectedProps = ConnectedDispatch & {
  state: { user: State }
}

export const userHOC = connect(
  (state: object) => ({ state }),
  (): ConnectedDispatch => ({
    $user: { set, clear, getRole }
  })
)