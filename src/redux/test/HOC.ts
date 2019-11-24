import { connect } from 'react-redux'
import {
  SET, CLEAR,
  ConnectedState
} from './index'
import store from '~/redux'

const { dispatch } = store

export const set = (name: string, age: number) => dispatch({ type: SET, name, age })
export const clear = () => dispatch({ type: CLEAR })

interface ConnectedDispatch {
  test: {
    set: typeof set,
    clear: typeof clear
  }
}

export type ConnectedProps = ConnectedDispatch & {
  state: { test: ConnectedState }
}


export default connect(
  state => ({ state }),
  (): ConnectedDispatch => ({
    test: { set, clear }
  })
)