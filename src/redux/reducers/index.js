// Imports: Dependencies
import { combineReducers } from 'redux';

// Imports: Reducers
import authReducer from './authReducer';
import deviceReducer from './deviceReducer';

// Redux: Root Reducer
const rootReducer = combineReducers({
  authReducer: authReducer,
  deviceReducer: deviceReducer,
});

// Exports
export default rootReducer;