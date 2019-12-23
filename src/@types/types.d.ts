import { Reducer } from '~/../node_modules/redux'

export interface ReduxAction {
  type: symbol,
  [key: string]: any
}

export interface ReduxReducer<State> extends Reducer<State, ReduxAction> {}