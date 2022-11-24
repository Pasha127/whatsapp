import React from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import UserMini from "../user/user-mini/userMini";
import { useEffect, useState } from "react";
import { getHistoryWithThunk } from "../../redux/actions";
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
      }  
    };  
}; 






const Home = (props) => {
    
    useEffect(()=>{
      props.getHistory()
    },[])


    return (
        <Container fluid className="home-container m-0" >
        <div>
            <div className="friendlist">            
                {props.history.map(chat =>{
                const person = chat.members.find(member => member._id !== props.user._id) 
                return (<UserMini key={`${person._id} chat`} name={person.username} avatar={person.avatar} _id={person._id} />)}
                )}  
                </div>
            <div className="chat-space">
                <Chat/>
            </div>
        </div>
       
        </Container>
    
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
