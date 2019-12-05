import { Reducer } from '~/../node_modules/redux'

export interface ReduxAction {
  type: symbol,
  [key: string]: any
}

export interface ReduxReducer<State> extends Reducer<State, ReduxAction> {}

// 用于materialUI的withTheme注入的theme对象
export interface ThemedComponentProps {
  theme: {
    mixins: {
      toolbar: {
        minHeight: number
      }
    }
  }
}