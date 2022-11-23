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
const mapStateToProps = state => {
  return {
  user: state.userInfo
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
      {props.user?<NavBar/>:<SplashNavBar />}
      <Routes>
        <Route path="/" exact element={props.user?  <Chat />:<LogIn />} />
        {/* <Route path="/new" element={props.user._id? <AnotherPage/>:<LogIn />} /> */}
      </Routes>
      {props.user && <Footer />}
    </Router>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
