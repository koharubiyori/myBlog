import { connect } from 'react-redux'
import {
  SET, CLEAR,
  ConnectedState
} from './index'
import store from '~/redux'
import user from '~/api/user'
import Cookies from 'js-cookie'

const { dispatch } = store

export const set = (data: Partial<ConnectedState>) => dispatch({ type: SET, data })
export const clear = () => dispatch({ type: CLEAR })

export const updateUserInfo = () => new Promise((resolve, reject) =>{
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

const stateName = 'user'
interface ConnectedDispatch {
  [stateName]: {
    set: typeof set,
    clear: typeof clear
  }
}

export type UserConnectedProps = ConnectedDispatch & {
  state: { [stateName]: ConnectedState }
}

export default connect(
  (state: object) => ({ state }),
  (): ConnectedDispatch => ({
    [stateName]: { set, clear }
  })
)