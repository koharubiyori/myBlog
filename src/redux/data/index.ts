import { ReduxReducer } from '~/@types/types'

export const SET = Symbol()
export const REMOVE = Symbol()

export interface State {
  tags: ApiData.Tag[]
}

const reducer: ReduxReducer<State> = (state = {
  tags: null as any
}, action) =>{
  switch(action.type){
    case SET: {
      return { 
        ...state,
        [action.name]: action.data 
      }
    }

    case REMOVE: {
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