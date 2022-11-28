import React from "react";
import { connect } from "react-redux";
import UserMini from "../user/user-mini/userMini";
import { useEffect, useState } from "react";
import {Container,Row,Col,Form,FormControl,ListGroup,Button} from "react-bootstrap";
import UsersSidebar from "../user/UsersSidebar";
import { getChatByIdWithThunk, getHistoryWithThunk, setOnline } from "../../redux/actions";
import "./styles.css"
import { sendInitialMessage } from "../chat/Chat";


const mapStateToProps = state => {
    return {
    user: state.userInfo,
    history: state.chats.list,
    onlineUsers: state.onlineUsers
    };
};
  
const mapDispatchToProps = dispatch => {
    return {
       getHistory: ()=> {
        dispatch(getHistoryWithThunk());
      },
      getChatById: (id)=> {
        dispatch(getChatByIdWithThunk(id));
      }
    };  
}; 

const handleSearch = async (emailQuery, history, user, onlineUsers) =>{
  const baseURL = process.env.REACT_APP_SERVER_URL
    const options = {
      method: 'GET' ,
      credentials:"include"
      };      
      const baseEndpoint = `${baseURL}/user/email/${emailQuery}`
        const response = await fetch(baseEndpoint, options);
      if (response.ok) {
        const data = await response.json()
        /* console.log("found by Email", data); */
        resultHandler(data, history, user, onlineUsers);                    
      } else{
        alert("404 - User Not Found" )
      }          
}

const resultHandler = (otherUser, history, user, onlineUsers)=>{
  if(history.length>0){ const existingChats = history.map(chat => {return(chat.members)});
/*   console.log("existingChats: ",existingChats) */
  const existingFriends = [];
  existingChats.map(members => {existingFriends.push(members[0]._id);existingFriends.push(members[1]._id) })
/*   console.log("existingFriends: ",existingFriends) */
  console.log(otherUser._id)
  if(existingFriends.includes(otherUser._id)){
   /*  console.log("chat exists") */
  alert("You are already friends!");
  }else{
    sendInitialMessage(user,otherUser);
  }
}else{
    sendInitialMessage(user,otherUser);
  }
} 



const Search = (props) => {
    const [query, setQuery] = useState("");

    return (
        <Form
            onSubmit={e => {
              e.preventDefault();
              handleSearch(query, props.history, props.user, props.onlineUsers);
            }}
            >
            <FormControl
            style={{width: "100%"}}
              placeholder="Add friends by email"
              value={query}
              onChange={e => { setQuery(e.target.value)}}
              />
          </Form>
    
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
