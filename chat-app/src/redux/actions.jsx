export const LOADING = " LOADING";
export const SEARCH = "SEARCH";
export const SET_USER_INFO = "SET_USER_INFO";
export const SET_CHATS = "SET_CHATS";
export const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";
export const SET_HISTORY = "SET_HISTORY";
export const NEW_MESSAGE = "NEW_MESSAGE";

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

export const getMeWithThunk = async () =>{
  const baseURL = process.env.REACT_APP_SERVER_URL
    const options = {
      method: 'GET' ,
      credentials:"include",
       headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',         
        } 
      };      
      const baseEndpoint = `${baseURL}/user/me`
      /* console.log("fetch blogs") */
      const response = await fetch(baseEndpoint, options);
      if (response.ok) {
        const data = await response.json()
        setUserInfo(data);            
          } else {
             const options2 = {
              method: 'POST' ,
              credentials:"include",
               headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',         
                } 
              };      
              const baseEndpoint2 = `${baseURL}/user/refreshTokens`
              const response2 = await fetch(baseEndpoint2, options2);
              if (response2.ok) {
                const data2 = await response2.json()
                setUserInfo(data2);             
                  } else {
                    console.log("Error fetching me");
                    logOutWithThunk()
            }             
    }
}

export const logOutWithThunk = async () =>{
  try{
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
      const response = await fetch(baseEndpoint, options);
      if (response.ok) {
        setUserInfo({});
      } else {
        console.log("error logging out")
      }
    }catch(error){
      console.log(error)
    }
    setUserInfo({});            
}
export const logInWithThunk = async (email, password) =>{
  try{
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
      const response = await fetch(baseEndpoint, options);
      if (response.ok) {
        const data = await response.json()
        setUserInfo(data);
      } else {
        console.log("error logging out")
      }
    }catch(error){
      console.log(error)
    }
    setUserInfo({});            
}
export const registerWithThunk = async (newUserData) =>{
  try{
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
      const response = await fetch(baseEndpoint, options);
      if (response.ok) {
        const data = await response.json()
        setUserInfo(data);
      } else {
        console.log("error logging out")
      }
    }catch(error){
      console.log(error)
    }
    setUserInfo({});            
}
