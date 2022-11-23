import React, { useEffect, useState } from "react";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import NewBlogPost from "./views/new/New";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./components/log-in/logIn";
import SplashNavBar from "./components/navbar/SplashNavbar";
import Chat from "./components/chat/Chat";
import { getMeWithThunk } from "./redux/actions";
import { connect } from "react-redux";
const mapStateToProps = state => {
  return {
  user: state.userinfo
  };
};
 const mapDispatchToProps = dispatch => {
  return {
   /*  setQuery: query => {
      dispatch(setSearch(query));
    },    */     
  };  
}; 

function App(props) {
 
useEffect(()=>{
  getMeWithThunk()
},[])


  return (
    <Router>
      {props.user._id?<NavBar/>:<SplashNavBar />}
      <Routes>
        <Route path="/" exact element={props.user._id?  <Chat  />:<LogIn />} />
        <Route path="/new" element={props.user._id? <NewBlogPost/>:<LogIn />} />
      </Routes>
      {props.user._id && <Footer />}
    </Router>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
