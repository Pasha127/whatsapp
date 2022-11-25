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
    setOnlineUsers: (users)=> {
      dispatch(setOnline(users));
    }
           
  };  
}; 



const Chat = (props) => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatHistory, setChatHistory] = useState(null);
  
  /* console.log("active chat outside socket: ", props.activeChat); */ // okay

  useEffect(()=>{
    setChatHistory(props.activeChat.messages)
  },[props.activeChat]);

  useEffect(() => {
  submitUsername()
  socket.on("welcome", welcomeMessage => {
    console.log("active chat in socket: ", props.activeChat);
/*     console.log(welcomeMessage); */
    
      socket.on("newMessage", receivedMessage => {
        console.log("newMessage ", receivedMessage);
        setChatHistory(chatHistory => [...chatHistory, receivedMessage]);
        });
     
    });
    }, []);

  socket.on("listUpdate", onlineUsersList => {
    console.log("New user online");
    setOnlineUsers(onlineUsersList);
    props.setOnlineUsers(onlineUsersList);
  });

  const submitUsername = () => {
    console.log("SUBMIT", props.user.username)
    socket.emit("setUsername", { username: props.user.email.split("@")[0] })
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
      {!chatHistory && <div className="splash-logo"></div>}
      {chatHistory && <Row style={{ height: "95%" }} className="my-3">
        <Col md={9} className="d-flex flex-column justify-content-between">
          {/* LEFT COLUMN */}
          {/* TOP AREA: USERNAME INPUT FIELD */}
          {/* {!loggedIn && ( */}
          {/* <Form
            onSubmit={e => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <FormControl
              placeholder="Search chat"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Form> */}
          {/* )} */}
          {/* MIDDLE AREA: CHAT HISTORY */}
          <ListGroup> {chatHistory.map((element, i) => (
              <ListGroup.Item key={i}>
                {/*  {console.log(props.activeChat.members.find(user => user._id !== props.user._id), "content")}  */}
                <strong>{element.sender === props.user._id? props.user.email.split("@")[0]:props.activeChat.members.find(user => user._id !== props.user._id).email.split("@")[0]} 
                </strong> | {element.content && element.content.text} at{" "}
                {new Date(element.createdAt).toLocaleTimeString("en-US")}
              </ListGroup.Item>
            ))}</ListGroup>
          {/* BOTTOM AREA: NEW MESSAGE */}
          <Form
            onSubmit={e => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <FormControl
              placeholder="Write your message here"
              value={message}
              onChange={e =>setMessage(e.target.value)}
            />
          </Form>
        </Col>
        <Col md={3}>
          {/* ONLINE USERS SECTION */}
          <div className="mb-3">Connected users:</div>
          {onlineUsers.length === 0 && (
            <ListGroup.Item>ERROR - Please Refresh</ListGroup.Item>
          )}
          <ListGroup>
            {onlineUsers.map(user => (
              <ListGroup.Item key={user.socketId}>{user.username}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>}
    </Container>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
