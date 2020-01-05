import { ReduxReducer } from '~/@types/types'
import settings from '~/api/settings'

export const SET = Symbol()
export const REMOVE = Symbol()

export interface State {
  tags: ApiData.Tag[]
  settings: Omit<ApiData.Settings, '_id'>
}

const reducer: ReduxReducer<State> = (state = {
  tags: JSON.parse(localStorage.getItem('data-tags') || '') as any,
  settings: JSON.parse(localStorage.getItem('data-settings') || '') as any
}, action) =>{
  switch(action.type){
    case SET: {
      localStorage.setItem('data-' + action.name, JSON.stringify(action.data))
      
      return { 
        ...state,
        [action.name]: action.data 
      }
    }

    case REMOVE: {
      localStorage.removeItem('data-' + action.name)
      
      return {
        ...state,
        [action.name]: null
      }
    }

    default: {
      return state
    }
  }
}

export default reducer