import React from "react";
import { Container } from "react-bootstrap";

const Footer = (props) => {
  const baseURL = process.env.REACT_APP_SERVER_URL
  return (
    <footer
      style={{
        paddingTop: 50,
        paddingBottom: 50,
      }}
    >
      <Container className="d-flex justify-content-between" >
        <div>{`${new Date().getFullYear()} - © Paul Levitsky | Developed for Epicode.`}</div>
        <a href={`${baseURL}/blogPosts/csv`}><p>Download All Content</p></a>
        </Container>
    </footer>
  );
};

export default Footer;
