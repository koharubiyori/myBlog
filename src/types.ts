export interface ReduxAction {
  type: symbol,
  [key: string]: any
}

export interface ReduxReducer<State> {
  (state: State, action: ReduxAction): State
}