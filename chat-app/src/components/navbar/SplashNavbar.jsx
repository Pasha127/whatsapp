import React from "react";
import { Container, Navbar } from "react-bootstrap";
import logo from "../../assets/logo.png";
import "./styles.css";
const SplashNavBar = (props) => {
  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-center">
        <Navbar.Brand>
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>       
      </Container>
    </Navbar>
  );
};

export default SplashNavBar;
