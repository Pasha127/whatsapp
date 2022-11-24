import { useEffect, useState } from "react";
import {Container,Row,Col,Form,FormControl,ListGroup,Button} from "react-bootstrap";
import {io} from "socket.io-client";
import { getMeWithThunk } from "../../redux/actions";
import { connect } from "react-redux";
import "./styles.css"

const socket = io("http://localhost:3001", {transports:["websocket"], withCredentials:true})
console.log()

const mapStateToProps = state => {
  return {
  user: state.userInfo,
  activeChat: state.chats.active
  };
};

 const mapDispatchToProps = dispatch => {
  return {
    getMe: ()=> {
      dispatch(getMeWithThunk());
    }     
  };  
}; 



const Chat = (props) => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  
  /* console.log("active chat outside socket: ", props.activeChat); */ // okay

  useEffect(()=>{
    console.log("chatHistory1", chatHistory)
    setChatHistory(props.activeChat.messages || ['nodata'])
    console.log("chatHistory2", chatHistory)
  },[props.activeChat]);

  useEffect(() => {
  socket.on("welcome", welcomeMessage => {
    console.log("active chat in socket: ", props.activeChat);
/*     console.log(welcomeMessage); */
    submitUsername()
    socket.on("loggedIn", onlineUsersList => {
      console.log("ONLINE USERS: ", onlineUsersList);
      setLoggedIn(true);
      setOnlineUsers(onlineUsersList);
      socket.on("listUpdate", onlineUsersList => {
        console.log("New user online");
        setOnlineUsers(onlineUsersList);
      });
      socket.on("newMessage", receivedMessage => {
        console.log("new message ", receivedMessage);
        setChatHistory(chatHistory => [...chatHistory, receivedMessage.message]);
        });
      });
    });
  }, []);

  const submitUsername = () => {
    console.log("SUBMIT", props.user.username)
    socket.emit("setUsername", { username: props.user.email.split("@")[0] })
    }

  const sendMessage = () => {
    const newMessage= {
      sender: username,
      text: message,
      createdAt: new Date().toLocaleString("en-US"),
    }
    socket.emit("sendMessage", { message: newMessage })
    setChatHistory([...chatHistory, newMessage])
  }

  return (
    <Container fluid>
      <Row style={{ height: "95%" }} className="my-3">
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
                {console.log(element.content  && element.content.text)}
                <strong>{element.sender} </strong> | {element.content && element.content.text} at{" "}
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
              onChange={e => setMessage(e.target.value)}
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
      </Row>
    </Container>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
