import React from "react";
import { Col, Image, Row } from "react-bootstrap";
import "./styles.css";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
  user: state.userInfo,
  history: state.chats.list
  };
};
 const mapDispatchToProps = dispatch => {
  return {
    /* getHistory: ()=> {
      dispatch(getHistoryWithThunk());
    }  */
  };  
}; 


const UserMini = (props) => {
  const chatPreview =() =>{
    const relevantChat = props.history.find(chat => {
      return chat.members.some(member=>{
        return member._id === props.person._id
      })
    })
    const messagePreview = relevantChat.messages[relevantChat.messages.length - 1].content.text;
   /*  console.log("userMini: ", messagePreview) */
    return messagePreview 
  }
  

  return (
    <Row className="tab-body m-0"
    onClick={()=>{props.getChat(props.person)}}>
      <Col xs={2}>
        <Image className="chat-head" src={props.person.avatar} roundedCircle />
      </Col>
      <Col>
        <h6 className="m-0">{props.person.email.split("@")[0]}</h6>
         <div className="chat-preview">"{`${chatPreview()}`}"</div> 
      </Col>
    </Row>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMini);
