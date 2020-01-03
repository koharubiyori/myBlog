import { connect } from 'react-redux'
import {
  SET, REMOVE,
  State
} from './index'
import store from '~/redux'
import tag from '~/api/tag'
import settings from '~/api/settings'

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

export const getSettings = (forceUpdate = false) =>{
  let {data} = getState()
  if(data.settings && forceUpdate) return Promise.resolve(data.settings)
  return settings.get().then(data =>{
    set('settings', data)
    return data
  })
} 

interface ConnectedDispatch {
  '$data': {
    set: typeof set
    remove: typeof remove
    getTags: typeof getTags
    getSettings: typeof getSettings
  }
}

export type DataConnectedProps = ConnectedDispatch & {
  state: { data: State }
}

export const dataHOC = connect(
  (state: object) => ({ state }),
  (): ConnectedDispatch => ({
    $data: { set, remove, getTags, getSettings }
  })
)