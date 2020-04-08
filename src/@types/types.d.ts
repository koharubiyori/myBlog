import { Reducer } from '~/../node_modules/redux'

export interface ReduxAction<Type> {
  type: Type
  [key: string]: any
}

export interface ReduxReducer<State, Type = symbol, ParamNames = any> extends Reducer<State, ReduxAction<Type>> {}