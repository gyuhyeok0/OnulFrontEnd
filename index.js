/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';  // 실제 앱 컴포넌트
import { name as appName } from './app.json';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';  // store와 persistor 불러오기

// Provider와 PersistGate 설정을 추가한 RootApp 컴포넌트
const RootApp = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
);

AppRegistry.registerComponent(appName, () => RootApp);
