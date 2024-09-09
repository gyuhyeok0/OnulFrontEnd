import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './modules'; // 리듀서 가져오기

// persist 설정
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux Toolkit의 미들웨어에서 직렬화 가능성 검사 비활성화
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: {
            // 특정 액션의 직렬화 불가능 값을 무시하도록 설정
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
    }),
});

export const persistor = persistStore(store);
