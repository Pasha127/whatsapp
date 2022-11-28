import { useEffect, useState } from "react";
import {Container,Row,Col,Form,FormControl,ListGroup,Button, ListGroupItem} from "react-bootstrap";
import {io} from "socket.io-client";
import { getMeWithThunk, setActiveChat, setOnline, setRecentMsg } from "../../redux/actions";
import { connect } from "react-redux";

import "./styles.css"
import { useRef } from "react";

const socket = io("http://localhost:3001", {transports:["websocket"], withCredentials:true})

const mapStateToProps = state => {
  return {
  user: state.userInfo,
  activeChat: state.chats.active,
  onlineUsers: state.onlineUsers,
  messageHistory: state.chats.active.messages
  };
};

 const mapDispatchToProps = dispatch => {
  return {
    getMe: ()=> {
      dispatch(getMeWithThunk());
    },
    setUsersRedux: (users)=> {
      dispatch(setOnline(users));
    },
    setReduxChatHistory: (chat)=>{
      dispatch(setActiveChat(chat))
    },                  
    setRecentMesg: (chat)=>{
      dispatch(setRecentMsg(chat))
    }                  
  };  
}; 

export const joinRoom = (otherId, relevantChat) =>{ 
 /*  console.log("person to join: ", otherId); */
  socket.emit("joinRoom", {chatRoomId:relevantChat._id})
}

export const emitLogOut = ()=>{
  socket.emit("logOut");
}

export const sendInitialMessage = (user, otherUser) => {
  console.log("initial members",[user,otherUser])
  socket.emit("setUsername", {_id:user._id, username: user.email.split("@")[0] })
  const newMessage= {
  "members": [user._id,otherUser._id],
  "message":
  {"sender": user,
  "content":{
    "text": `${user.email.split("@")[0]} has started a chat with you!`,
    "media": "imageURLGoesHere"
        }
      }      
    }
    socket.emit("sendMessage", { message: newMessage })
  }





const Chat = (props) => {
  const anchor = useRef(null);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const {_id,email} = props.user
  /* console.log("active chat outside socket: ", props.activeChat); */ // okay


  useEffect(()=>{
/*     console.log('fire1', props.activeChat.messages ) */
    setChatHistory(props.activeChat.messages)    
  },[props.activeChat]);

  useEffect(() => {
    props.setUsersRedux(["TESING"]);
/*     console.log('fire2') */
    submitUsername(_id,email)   
    socket.on("welcome", welcomeMessage => {
   /*    console.log(welcomeMessage); */
      
    });
  }, []);
  
  useEffect(() => {
    socket.on("newMessage", receivedMessage => {
 /*      console.log("chatHistory: ",chatHistory)
      console.log("StateChatHistory: ",props.messageHistory)
      console.log("newMessage ", receivedMessage); */
      const newEntry = {...receivedMessage, createdAt: new Date()}
      setChatHistory(chatHistory =>[...chatHistory,newEntry]);
      scrollToBottom()
      props.setRecentMesg(newEntry)
    });
    
    socket.on("listUpdate", onlineUsersList => {
/*       console.log("New user online: ", onlineUsersList); */
      setOnlineUsers(onlineUsersList);
      props.setUsersRedux(onlineUsersList);
    });

    
  }, [socket]);

    const scrollToBottom = () =>{
      anchor.current?.scrollIntoView({ behavior: "smooth" })
    }

    const submitUsername = (userId, emailAddress) => {
      socket.emit("setUsername", {_id:userId, username: emailAddress.split("@")[0] })
    }
    
    const sendMessage = () => {
      const newMessage= {
      "members": [props.activeChat.members[0]._id,props.activeChat.members[1]._id],
      "message":
      {"sender": props.user._id,
      "content":{
        "text":message,
        "media": "imageURLGoesHere"
            }
          }      
        }
        socket.emit("sendMessage", { message: newMessage })
        setMessage("")        
      }
      
      return (
        <Container fluid>
        {props.activeChat._id && <Col md={12} className={"fixed-bottom pl-0 chatbar"}  >
          <Form
            onSubmit={e => {
              e.preventDefault();
              sendMessage();
            }}
            >
            <FormControl
            style={{width: "100vw"}}
              placeholder="Write your message here"
              value={message}
              onChange={e =>setMessage(e.target.value)}
              />
          </Form>
              </Col>}
      {!chatHistory && <div className="splash-logo"></div>}
      {chatHistory && <Row style={{ height: "95%" }} className="my-3">
        <Col md={12} className="d-flex flex-column justify-content-between pb-5">
          <ListGroup> {chatHistory.map((element, i) => (
              <ListGroup.Item key={i}>
                <strong>{element.sender === props.user._id? props.user.email.split("@")[0]:props.activeChat.members.find(user => user._id !== props.user._id).email.split("@")[0]} 
                </strong> | {element.content && element.content.text} at{" "}
                {new Date(element.createdAt).toLocaleTimeString("en-US")}
              </ListGroup.Item>
                
            ))}
            {<ListGroup.Item ref={anchor} className="invisible mt-2 "/>}
            </ListGroup>

        </Col>        
      </Row>}
    </Container>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
