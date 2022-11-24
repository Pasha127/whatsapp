import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import reducer from './reducer';

export const initialState = {
  isLoading: false,
  query: "",
  userInfo: {
    _id: "",
    username: "",
    email: "",
    avatar: ""
},
chats: {
  active: {}, 
  list: []
}

} 

export const store = configureStore({
  /* reducer: persistedReducer, */
  reducer: reducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})
