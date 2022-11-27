export const LOADING = " LOADING";
export const SEARCH = "SEARCH";
export const SET_USER_INFO = "SET_USER_INFO";
export const SET_CHATS = "SET_CHATS";
export const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";
export const SET_HISTORY = "SET_HISTORY";
export const NEW_MESSAGE = "NEW_MESSAGE";
export const SET_ONLINE = "SET_ONLINE";

export const setLoading =isLoading =>({
    type:LOADING,
    payload: isLoading
  });
export const setSearch =query =>({
    type:SEARCH,
    payload: query
  });
export const setUserInfo = user =>({
    type: SET_USER_INFO,
    payload: user
});
export const setChats = input =>({
    type: SET_CHATS,
    payload: input
});
export const setActiveChat = input =>({
    type: SET_ACTIVE_CHAT,
    payload: input
});
export const setHistory = input =>({
    type: SET_HISTORY,
    payload: input
});
export const newMessage = input =>({
    type: NEW_MESSAGE,
    payload: input
});
export const setOnline = input =>({
    type: SET_ONLINE,
    payload: input
});


export const getChatByIdWithThunk = (id) =>{
  const baseURL = process.env.REACT_APP_SERVER_URL
    const options = {
      method: 'GET' ,
      credentials:"include"
      };      
      const baseEndpoint = `${baseURL}/chat/${id}`
      /* console.log("fetch blogs") */

      return async (dispatch, getState) =>{

        const response = await fetch(baseEndpoint, options);
       /*  console.log("get chat by id: ", response); */
      if (response.ok) {
        const data = await response.json()
        console.log("chat from ID: ", data);
        dispatch(setActiveChat(data));            
      } else {
        dispatch(logOutWithThunk())
      }             
    }
}

export const getMeWithThunk = () =>{
  const baseURL = process.env.REACT_APP_SERVER_URL
    const options = {
      method: 'GET' ,
      credentials:"include"
      };      
      const baseEndpoint = `${baseURL}/user/me`
      /* console.log("fetch blogs") */

      return async (dispatch, getState) =>{

        const response = await fetch(baseEndpoint, options);
        console.log("test get me", response);
      if (response.ok) {
        const data = await response.json()
        console.log("test resp", data);
        dispatch(setUserInfo(data[0]));            
      } else {
        dispatch(logOutWithThunk())
      }             
    }
}

export const logOutWithThunk = () =>{
  
  const baseURL = process.env.REACT_APP_SERVER_URL
    const options = {
      method: 'PUT' ,
      credentials:"include",
       headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',         
        } 
      };      
      const baseEndpoint = `${baseURL}/user/logout`
      return async (dispatch, getState) =>{try{
      const response = await fetch(baseEndpoint, options);
      if (response.ok) {
        
      } else {
        console.log("error logging out")
      }
    }catch(error){
      console.log(error)
    }
    dispatch(setUserInfo({}));            
}}

export const logInWithThunk =  (email, password) =>{

  const baseURL = process.env.REACT_APP_SERVER_URL
    const options = {
      method: 'PUT' ,
       headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',         
        } ,
        body:JSON.stringify({email,password})
      };      
      const baseEndpoint = `${baseURL}/user/login`
      return async (dispatch, getState) =>{  try{
      const response = await fetch(baseEndpoint, options);
      if (response.ok) {
        const data = await response.json()
        dispatch(setUserInfo(data));
      } else {
        console.log("error logging out")
      }
    }catch(error){
      console.log(error)
    }
    dispatch(setUserInfo({}));            
}}
export const registerWithThunk =  (newUserData) =>{
  
  const baseURL = process.env.REACT_APP_SERVER_URL
    const options = {
      method: 'POST' ,
       headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',         
        } ,
        body:JSON.stringify(newUserData)
      };      
      const baseEndpoint = `${baseURL}/user/register`
      return async (dispatch, getState) =>{try{
      const response = await fetch(baseEndpoint, options);
      if (response.ok) {
        const data = await response.json()
        dispatch(setUserInfo(data));
      } else {
        console.log("error logging out")
      }
    }catch(error){
      console.log(error)
    }
   dispatch( setUserInfo({}));            
}}

export const getHistoryWithThunk = () => {
  const baseURL = process.env.REACT_APP_SERVER_URL
  const options = {
      method: 'GET' ,
      credentials:"include"
  };      
  const baseEndpoint = `${baseURL}/chat/me/history`
  /* console.log("fetch blogs") */
  return async (dispatch, getState) =>{
  const response = await fetch(baseEndpoint, options);
  /* console.log("test get me", response); */
  if (response.ok) {
      const data = await response.json()
      console.log("get all users", data);
      dispatch(setHistory(data))            
  } else {
      console.log("Error - Could not retrieve chats!") 
  }             
}}