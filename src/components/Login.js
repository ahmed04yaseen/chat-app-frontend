import axios from "axios";
import React, { useState } from "react";
import { Container, Row, Col, Visible } from "react-grid-system";
import {Link, useNavigate} from "react-router-dom"
import "../css/Signup.css"
import MainImage from "../images/mainSignup.gif";
import Footer from "../utils/Footer";
import Header from "../utils/Header";
const domain = process.env.REACT_APP_MY_API;

function Login() {
  let navigate= useNavigate()
  const [data,setData] = useState({
    email: "",
    password: ""
  })
  const [type,setType] = useState("password")
  const showPassword = () =>{
    if(type === "password"){
      setType("text")
    }else{
      setType("password")
    }
  }
  const changeHandler = (e) =>{
    setData({
      ...data,
      [e.target.id] : e.target.value
    })
  }
  const login = () =>{
    axios.post(`${domain}/api/user/login`,{email: data.email, password: data.password}).then(res=>{
      localStorage.setItem("access_token", res.data.token)
      navigate("/home")
    }).catch(err=>{
      alert("Invalid Credentials")
    })
  }
  return (
    <div>
      <Header />
      <Container>
        <Row>
        <Visible xl lg>
          <Col>
            <img src={MainImage} alt= "main"className="mainImage" />
          </Col>
          </Visible>
          <Col>
          <div className="signup_boxDiv">
              <div className="su_main_head">Chat App</div>
              <div className="su_title_desc">Login into your account</div>
              <form>
          
                <div className="mb-1">
                <label className="form-label su_label">Email Id</label>
                <input type="email" className="form-control" value={data.email} onChange={changeHandler} id="email"/>
                </div>
                <div className="mb-1">
                <label className="form-label su_label">Password</label>
                <div style={{display: "flex", alignItems:"center"}} >

                <input type={type} className="form-control" value={data.password} onChange={changeHandler} id="password"/>
                {
                  data.password !== "" ? type === "password" ?<div style={{marginLeft: "-50px", cursor:"pointer"}} onClick={showPassword}>Show</div> : <div style={{marginLeft: "-50px", cursor:"pointer"}} onClick={showPassword}>Hide</div> :<></>
                }
                
                </div>
                </div>
                <div type="submit" className="su_btn" onClick={login}>Login</div>
        </form>
          </div>
          <div className="signup_boxDivSmall">
            <div>Don't have an account? <Link to="/signup" className="su_link">SignUp</Link></div>
          </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default Login;
