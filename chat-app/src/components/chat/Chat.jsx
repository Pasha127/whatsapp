import { useEffect, useState } from "react";
import {Container,Row,Col,Form,FormControl,ListGroup,Button} from "react-bootstrap";
import {io} from "socket.io-client";


const socket = io("https://cog-chat.herokuapp.com/", {transports:["websocket"]})
console.log()

const Chat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
  socket.on("welcome", welcomeMessage => {
    console.log(welcomeMessage);
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
  });

  const submitUsername = () => {
    console.log("SUBMIT")
    socket.emit("setUsername", { username })
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
      <Row style={{ height: "95vh" }} className="my-3">
        <Col md={9} className="d-flex flex-column justify-content-between">
          {/* LEFT COLUMN */}
          {/* TOP AREA: USERNAME INPUT FIELD */}
          {/* {!loggedIn && ( */}
          <Form
            onSubmit={e => {
              e.preventDefault();
              submitUsername();
            }}
          >
            <FormControl
              placeholder="Set your username here"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Form>
          {/* )} */}
          {/* MIDDLE AREA: CHAT HISTORY */}
          <ListGroup> {chatHistory.map((element, i) => (
              <ListGroup.Item key={i}>
                <strong>{element.sender} </strong> | {element.text} at{" "}
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
            <ListGroup.Item>Log in to check who's online!</ListGroup.Item>
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

export default Chat