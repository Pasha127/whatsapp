import React, { useCallback, useState } from "react";
import { Button, Container, Form, Row,Image } from "react-bootstrap";
import "./styles.css"
import {BsFillImageFill,BsPersonBoundingBox } from "react-icons/bs";
import { connect } from "react-redux";
import { getMeWithThunk } from "../../redux/actions";

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


const LogIn = (props) => {
    const baseURL = process.env.REACT_APP_SERVER_URL

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarDataURL, setAvatarDataURL] = useState({});
  const [wantLogIn, setWantLogIn] = useState(true);

const postAvatar = async (id) =>{ 
  let formData = new FormData()
  formData.append('image', avatar)
  const options = {
    method: 'POST',
    credentials:"include",    
    body: formData
    };
    const baseEndpoint = `${baseURL}/user/avatar`///must add cloudinary in backend
    try {    
      const response = await fetch(baseEndpoint, options);
      if (response.ok) {           
        const data = await response.json() 
        console.log(data)       
     } else {
       alert('Error fetching in avatar upload')
     } 
    } catch (error) {
      console.log(error)
    }finally{console.log("submitted avatar");}
  }

const readAvatar = (e)=>{
  const file = e.target.files[0]
  setAvatar(file);
  let fileReader, isCancel = false;
      if (file) {
        fileReader = new FileReader();
        fileReader.onload = (e) => {
          const { result } = e.target;
          if (result && !isCancel) {
            setAvatarDataURL(result)
          }
        }
        fileReader.readAsDataURL(file);
      }
      return () => {
        isCancel = true;
        if (fileReader && fileReader.readyState === 1) {
          fileReader.abort();
        }
      }
}

 const postNewUser = async (postObj) => {
    const options = {
        
      method: 'POST',
      credentials:'include',
          headers: {"Content-Type": "application/json",
          },
          body: JSON.stringify(postObj)
        
      };
      const baseEndpoint = `${baseURL}/user/register`
    /* console.log("1 submit-post")  */   
      try {
        /* console.log("2 submit-post",baseEndpoint) */        
        const response = await fetch(baseEndpoint,options);
        if (response.ok) {           
          const data = await response.json()
          console.log(data._id);
          await postAvatar(data._id)          
       } else {
         alert('Error fetching results')
       } 
      } catch (error) {
        console.log(error)
      }finally{props.getMe()}
    }


const handleSubmit = (e) => {
    e.preventDefault()
    const postObj = {username,password,email}
    console.log(postObj);
    postNewUser(postObj);
  }

const handleLogIn = async (e) =>{ 
    e.preventDefault()
    const postObj = {password,email}
    const options = {        
        method: 'PUT',
        credentials:'include',
            headers: {"Content-Type": "application/json",
            },
            body: JSON.stringify(postObj)          
        };
        const baseEndpoint = `${baseURL}/user/login`
        try {     
          const response = await fetch(baseEndpoint,options);
          if (response.ok) {           
            const data = await response.json()
            console.log(data._id);  
         } else {
           alert('Error fetching results')
         } 
        } catch (error) {
          console.log(error)
        }finally{props.getMe()}
    
}



  return (<>
    <div className="background-gears"></div>
    <div className="background-gears gear2"></div>
    <div className="background-gears gear3"></div>
    <div className="background-gears gear4"></div>
    <div className="background-gears gear5"></div>
    <Container className="new-blog-container ">      
      {wantLogIn? 
      <div className="log-in-box">
        <Form>
        <Form.Group controlId="Email" className="mt-1 col-12">
            <Form.Label>Email</Form.Label>
          <Form.Control size="lg" placeholder="Email"onChange={(e)=>{setEmail(e.target.value)}} />
            </Form.Group>
            <Form.Group controlId="Password" className="mt-1  col-12">
          <Form.Label>Password</Form.Label>
          <Form.Control size="lg" type="password" placeholder="Password"onChange={(e)=>{setPassword(e.target.value)}} />
          </Form.Group> 
            <Form.Group className="mt-3  col-12 justify-content-around d-flex">
        <Button variant="outline-dark"
        onClick={(e) => {handleLogIn(e)}}
        type="submit"
        size="lg"
        >
            Log-In
          </Button>
        <Button
            onClick={(e) => setWantLogIn(false)}
            size="lg"
            variant="dark"         
            >
            Register
          </Button>
          </Form.Group>
        </Form>
      </div>
      
      
      :<Form className="mt-5 register-box">
        
          <div className="d-flex justify-content-center">
            <div className="col-2 p-0 d-flex border rounded pic-space">
        <label className="uploaded-pic" htmlFor="avatarUploadBtn">{!avatar ? <BsPersonBoundingBox style={{fontSize: "25px", color: "gray", cursor: "pointer"}}></BsPersonBoundingBox>:<img className="uploaded-pic" src={avatarDataURL} alt="avatar"/>}</label>
                          <input type="file" className="d-none" id="avatarUploadBtn"
                          onChange={(e)=>{readAvatar(e)}}></input>
                          </div>
                          </div>        
        <Form.Group controlId="Username" className="mt-1 col-12">
          <Form.Label>Username</Form.Label>
          <Form.Control size="lg" placeholder="Username"onChange={(e)=>(setUsername(e.target.value))} />
        </Form.Group>         
        <Form.Group controlId="Password" className="mt-1  col-12">
          <Form.Label>Password</Form.Label>
          <Form.Control size="lg" type="password" placeholder="Password"onChange={(e)=>(setPassword(e.target.value))} />
          </Form.Group>         
        <Form.Group controlId="email" className="mt-1  col-12">
          <Form.Label>E-mail</Form.Label>
          <Form.Control size="lg" placeholder="E-mail"onChange={(e)=>(setEmail(e.target.value))} />
          </Form.Group>         
        <Form.Group className="mt-3  col-10">
        <Button type="reset" size="lg" variant="outline-dark" onClick={(e) => setWantLogIn(true)}>
        Back
          </Button>
        <Button
            onClick={(e) => handleSubmit(e)}
            type="submit"
            size="lg"
            variant="dark"
            style={{
                marginLeft: "1em",
            }}
            >
            Register
          </Button>
          </Form.Group>         
      </Form>}
    </Container>
    <div className="d-flex flex-wrap justify-content-center mt-5">
    <a className="background4button" href="http://localhost:3001/user/googleLogin">
    <Button
            onClick={()=>{
              props.getMe();
            }}
            className="oauth-button"
            size="lg"
            variant="outline-dark"            
            >
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4="></img>
            Sign in with Google
          </Button></a>

        
    </div>
              </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);
