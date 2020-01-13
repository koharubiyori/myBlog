import { createStore, combineReducers } from '~/../node_modules/redux'

import user from './user'
import data from './data'

const reducers = combineReducers({ user, data })
const store = createStore(reducers, 
  process.env.NODE_ENV === 'development' &&  
  typeof __REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' && 
  __REDUX_DEVTOOLS_EXTENSION__()
)

export default store