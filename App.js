import React from 'react';
import AppNavigator from './src/navigation/RootNavigation';

import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store/store';

export default class App extends React.Component {
  
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <Provider store={store}>
                <PersistGate 
                    loading={null}
                    persistor={persistor} >
                    <AppNavigator />
                </PersistGate>
            </Provider>
          );
    }
}
  