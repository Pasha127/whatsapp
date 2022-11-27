import { useEffect, useState } from "react";
import {Container,Row,Col,Form,FormControl,ListGroup,Button} from "react-bootstrap";
import {io} from "socket.io-client";
import { getMeWithThunk, setOnline } from "../../redux/actions";
import { connect } from "react-redux";

import "./styles.css"

const socket = io("http://localhost:3001", {transports:["websocket"], withCredentials:true})

const mapStateToProps = state => {
  return {
  user: state.userInfo,
  activeChat: state.chats.active,
  onlineUsers: state.onlineUsers
  };
};

 const mapDispatchToProps = dispatch => {
  return {
    getMe: ()=> {
      dispatch(getMeWithThunk());
    },
    setUsersRedux: (users)=> {
      dispatch(setOnline(users));
    }
           
  };  
}; 

export const joinRoom = (otherId, peopleOnline) =>{ 
  console.log("person to join: ", otherId);
  const otherPerson = peopleOnline.find(user=> user._id === otherId)
  console.log("person socket Id", otherPerson.socketId);
  socket.emit("joinRoom", {chatRoomId:otherPerson.socketId})
}


const Chat = (props) => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatHistory, setChatHistory] = useState(null);
  const {_id,email} = props.user
  /* console.log("active chat outside socket: ", props.activeChat); */ // okay

  useEffect(()=>{
    console.log('fire1')
    setChatHistory(props.activeChat.messages)
  },[props.activeChat]);

  useEffect(() => {
    props.setUsersRedux(["TESING"]);
    console.log('fire2')
    submitUsername(_id,email)   
    socket.on("welcome", welcomeMessage => {
      console.log(welcomeMessage);
      
    });
  }, []);
  
  useEffect(() => {
    socket.on("newMessage", receivedMessage => {
      console.log("newMessage ", receivedMessage);
      setChatHistory(chatHistory => [...chatHistory, {...receivedMessage, createdAt: new Date()}]);
    });
    
    socket.on("listUpdate", onlineUsersList => {
      console.log("New user online: ", onlineUsersList);
      setOnlineUsers(onlineUsersList);
      props.setUsersRedux(onlineUsersList);
    });
  }, [socket]);
    const submitUsername = (userId, emailAddress) => {
      socket.emit("setUsername", {_id:userId, username: emailAddress.split("@")[0] })
    }
    
    const sendMessage = () => {
      console.log([props.activeChat.members[0]._id,props.activeChat.members[1]._id])
      const newMessage= {"members": [props.activeChat.members[0]._id,props.activeChat.members[1]._id],
      "message":
      {"sender": props.user._id,
      "content":{
        "text":message,
        "media": "imageURLGoesHere"
            }
          }      
        }
        socket.emit("sendMessage", { message: newMessage })
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
            ))}</ListGroup>

        </Col>        
      </Row>}
    </Container>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
