import { connect } from 'react-redux'
import {
  SET, REMOVE,
  ConnectedState
} from './index'
import store from '~/redux'
import tag from '~/api/tag'

const { dispatch, getState } = store

export const set = (name: string, data: any) => dispatch({ type: SET, name, data })
export const remove = () => dispatch({ type: REMOVE })

export const getTags = (forceUpdate = false) =>{
  let {data} = getState()
  if(data.tags && !forceUpdate) return Promise.resolve(data.tags)
  return tag.getAll().then(data =>{
    set('tags', data)
    return data
  })
}

interface ConnectedDispatch {
  '$data': {
    set: typeof set
    remove: typeof remove
    getTags: typeof getTags
  }
}

export type DataConnectedProps = ConnectedDispatch & {
  state: { data: ConnectedState }
}

export const dataHOC = connect(
  (state: object) => ({ state }),
  (): ConnectedDispatch => ({
    $data: { set, remove, getTags }
  })
)