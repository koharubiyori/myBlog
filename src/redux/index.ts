import { createStore, combineReducers } from '~/../node_modules/redux'

import test from './test'

const reducers = combineReducers({ test })
const store = createStore(reducers)

export default store