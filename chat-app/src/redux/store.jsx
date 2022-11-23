import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import reducer from './reducer';

export const initialState = {
  isLoading: false,
  query: "",
  userInfo: {
    _id: null,
    name: "",
    email: "",
    avatar: ""
},
chats: {
  active: "", 
  list: []
}

} 

export const store = configureStore({
  /* reducer: persistedReducer, */
  reducer: reducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})
