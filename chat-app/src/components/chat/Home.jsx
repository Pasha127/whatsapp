import React from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import UserMini from "../user/user-mini/userMini";
import { useEffect, useState } from "react";
import { getChatByIdWithThunk, getHistoryWithThunk } from "../../redux/actions";
import Chat from "./Chat";
import "./styles.css"


const mapStateToProps = state => {
    return {
    user: state.userInfo,
    history: state.chats.list
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







const Home = (props) => {
    const [targetChat, setTargetChat] = useState("");
    
    useEffect(()=>{
      props.getHistory()
    },[])

const getRelevantChatForPerson = (targetPerson) =>{      
    const relevantChat = props.history.find(chat => {
        return chat.members.some(member=>{
          return member._id === targetPerson._id
        })
      })  
      /* console.log("relevantChat:",relevantChat); */
        props.getChatById(relevantChat._id)
    }


    return (
        <Container fluid className="home-container m-0" >
        <div>
            <div>{console.log(props.history)}</div>
            <div className="friendlist">            
                {props.history.map(chat =>{
                const person = chat.members.find(member => member._id !== props.user._id) 
                return (<UserMini key={`${person._id} chat`} person={person} getChat={getRelevantChatForPerson} />)}
                )}  
                </div>
            <div className="chat-space">
                <Chat targetChat={targetChat}/>
            </div>
        </div>
       
        </Container>
    
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
