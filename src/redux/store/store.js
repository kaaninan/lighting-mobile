import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import rootReducer from '../reducers/index';

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,

	whitelist: [
		// 'experimentReducer',
		'authReducer',
	],

	blacklist: [
		// 'bufferReducer',
		// 'locationReducer',
		// 'labstarReducer'
	],
};

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middlewareEnhancer = applyMiddleware(
	thunk,
);

const store = createStore(persistedReducer, composeWithDevTools(middlewareEnhancer));
const persistor = persistStore(store);

export {
	store,
	persistor,
};
