import React, { useEffect, useState } from "react";
import NavBar from "./components/navbar/GeneralNavbar";
import Footer from "./components/footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./components/log-in/logIn";
import SplashNavBar from "./components/navbar/SplashNavbar";
import Chat from "./components/chat/Chat";
import { getMeWithThunk } from "./redux/actions";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/chat/Home";

const mapStateToProps = state => {
  return {
  user: state.userInfo
  };
};

 const mapDispatchToProps = dispatch => {
  return {
    getMe: ()=> {
      dispatch(getMeWithThunk());
    }     
  };  
}; 

function App(props) {
 
useEffect(()=>{
  props.getMe()
  console.log('fire4')
},[])


return (
  <Router>
      {props.user?._id && <NavBar/>}
      {!props.user?._id && <SplashNavBar/>}
      <Routes>
        {props.user?._id && <Route path="/" exact element={<Home/>} />}
        {!props.user?._id && <Route path="/" exact element={<LogIn />} />}
        {/* <Route path="/new" element={props.user._id? <AnotherPage/>:<LogIn />} /> */}
      </Routes>
      {/* {props.user?._id && <Footer />} */}
    </Router>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
