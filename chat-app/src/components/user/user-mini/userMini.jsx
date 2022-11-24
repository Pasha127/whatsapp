import React from "react";
import { Col, Image, Row } from "react-bootstrap";
import "./styles.css";
import { connect } from "react-redux";
const mapStateToProps = state => {
  return {
  user: state.userInfo
  };
};
 const mapDispatchToProps = dispatch => {
  return {
   /*  getMe: ()=> {
      dispatch(getMeWithThunk());
    }      */
  };  
}; 


const userMini = (props) => {
  const { name, _id, avatar } = props;
  
  return (
    <Row>
      <Col xs={2}>
        <Image className="blog-author" src={avatar} roundedCircle />
      </Col>
      <Col>
        <div>by</div>
        <h6>{name}</h6>
      </Col>
    </Row>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(userMini);
