import { initialState } from "./store/store";
import {LOADING,SEARCH,SET_USER_INFO,SET_CHATS,SET_ACTIVE_CHAT,SET_HISTORY,NEW_MESSAGE } from "./actions";
const reducer = (state = initialState.user, action) => {
    switch (action.type) {
      case LOADING:
        return {
          ...state,
          isLoading: action.payload        
        };        
      case SEARCH:
        return {
          ...state,
          query: action.payload        
        };        
      case SET_USER_INFO:
        return {
          ...state,
          userInfo: action.payload        
        };        
      case SET_CHATS:
        return {
          ...state,
          chats: {active:state.chats.active, list:action.payload}        
        };        
        
      case SET_ACTIVE_CHAT:
        return {
          ...state,
          chats: {active:action.payload, list:state.chats.list}        
        };        
      case SET_HISTORY:
        return {
          ...state,
          chats: action.payload      
        };                
      case NEW_MESSAGE:
        return {
          ...state,
          chats: {active:action.payload.chatId,list:[...state.chats.list,action.payload.message]}        
        };        
     
      default:
        return state; 
    }
  };
export default reducer;