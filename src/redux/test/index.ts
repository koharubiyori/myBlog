import { ReduxReducer } from '~/types'

export const SET = Symbol()
export const CLEAR = Symbol()

export interface ConnectedState {
  name: string
  age: number
}

export const reducer: ReduxReducer<ConnectedState> = (state = {
  name: 'lee',
  age: 19
}, action) =>{
  switch(action.type){
    case SET: {
      return {
        name: action.name,
        age: action.age
      }
    }

    case CLEAR: {
      return {
        name: '',
        age: 0
      }
    }

    default: {
      return state
    }
  }
}