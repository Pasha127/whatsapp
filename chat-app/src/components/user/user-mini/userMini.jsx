import React, { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import "../styles.css";
import { connect } from "react-redux";
import { joinRoom } from "../../chat/Chat";
import { setActiveChat, setChats } from "../../../redux/actions";

const mapStateToProps = state => {
  return {
  user: state.userInfo,
  history: state.chats.list,
  activeChat: state.chats.active,
  onlineUsers: state.onlineUsers
  };
};
 const mapDispatchToProps = dispatch => {
  return {
    setActiveChatHistory: (chat)=>{
      dispatch(setActiveChat(chat))
    }
  };  
}; 

const JoinRelevantChat = (history, person)=>{
  const relevantChat = history.find(chat => {
    return chat.members.some(member=>{
      return member._id === person._id
    })
  })
  joinRoom(person._id, relevantChat)
}



const UserMini = (props) => {
  
  const [isOnline, setIsOnline] = useState(false);
  const [chatPreviewLine, setChatPreviewLine] = useState("");
  
  useEffect(()=>{
   /*  console.log("onlineUsers",props.onlineUsers) */
    const users = props.onlineUsers.map(user => {return(user._id)})
    if(users.includes(props.person._id)){setIsOnline(true)}else{setIsOnline(false)}
  },[props.onlineUsers, props.person._id])


  
  const findRelevantChatWithRedux = () =>{
    const relevantChat = props.history.find(chat => {
      return chat.members.some(member=>{
        return member._id === props.person._id
      })
    })
    return relevantChat
  }
  
  const chatPreview =() =>{
    const relevantChat = findRelevantChatWithRedux()
    const messagePreview = relevantChat.messages[relevantChat.messages.length - 1].content.text;
    return messagePreview 
  }
 
  useState(()=>{
    setChatPreviewLine(chatPreview())
  })

  let relevantChatVar = null;
  return (
    <Row className="tab-body m-0"
    onClick={()=>{props.getChat(props.person); JoinRelevantChat(props.history, props.person);  /* setChathistoryOnClick() */}}>
      <Col xs={2}>
        <Image className="chat-head" src={props.person.avatar} roundedCircle />
        {isOnline && <div className="online"></div>}
      </Col>
      <Col>
        <h6 className="truncate m-0">{props.person.email.split("@")[0]}</h6>
         <div className="truncate">"{`${chatPreviewLine}`}"</div> 
      </Col>
    </Row>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMini);
