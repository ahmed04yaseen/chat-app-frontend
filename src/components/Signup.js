import React, { useState } from "react";
import { Container, Row, Col, Visible } from "react-grid-system";
import MainImage from "../images/mainSignup.gif";
import {useNavigate} from "react-router-dom"
import axios from "axios"
import "../css/Signup.css"
import {Link} from "react-router-dom"
import Header from "../utils/Header";
import Footer from "../utils/Footer";
const domain = process.env.REACT_APP_MY_API;

function Signup() {
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    photo:""

  })
  let changeHandler = (e) =>{
    setData({
      ...data,
      [e.target.id] : e.target.value
    })
  }
  let imageChange = (e) =>{
    setData({
      ...data,
      photo: e.target.files[0]
    })
  }
  const [type,setType] = useState("password")
  const showPassword = () =>{
    if(type === "password"){
      setType("text")
    }else{
      setType("password")
    }
  }
  let registerUser = (e) =>{
    e.preventDefault();
    if(data.photo !== ""){
      let formdata = new FormData();
      formdata.append("file" ,data.photo)
    
      axios.post(`${domain}/api/user/imageUpload`, formdata).then(res=>{
        axios.post(`${domain}/api/user/register`, {name: data.name, email: data.email, password: data.password, photo: res.data}).then(res=>{
          localStorage.setItem("access_token", res.data.token)
          navigate("/home")

        }).catch(err=>{
          alert("Email Id already taken")
        })
      })
    }else{
      axios.post(`${domain}/api/user/register`, {name: data.name, email: data.email, password: data.password}).then(res=>{

        localStorage.setItem("access_token", res.data.token)
        navigate("/home")
      }).catch(err=>{
        alert("Email Id already taken")
      })
    }
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
              <div className="su_title_desc">Create an account to chat with people you Love</div>
              <form>
              <div className="mb-1">
                <label className="form-label su_label">Name</label>
                <input type="text" id="name" onChange={changeHandler} className="form-control" value={data.name}/>
                </div>
                <div className="mb-1">
                <label className="form-label su_label">Email Id</label>
                <input type="email" className="form-control" id="email" onChange={changeHandler} value={data.email}/>
                </div>
                <div className="mb-1">
                <label className="form-label su_label">Password</label>
                <div style={{display: "flex", alignItems:"center"}}>

                <input type={type} className="form-control" id="password" onChange={changeHandler}  value={data.password}/>
                {
                   data.password !== "" ? type === "password" ?<div style={{marginLeft: "-50px", cursor:"pointer"}} onClick={showPassword}>Show</div> : <div style={{marginLeft: "-50px", cursor:"pointer"}} onClick={showPassword}>Hide</div> :<></>
                }
                
                </div>
                </div>
                <div className="mb-1">
                <label className="form-label su_label">Profile Pic (optional)</label>
                <input type="file" className="form-control" onChange={imageChange}/>
                </div>
                <div type="submit" className="su_btn" onClick={registerUser}>Sign Up</div>
                <div>By Signing up you accept terms and conditions</div>
              </form>
          </div>
          <div className="signup_boxDivSmall">
            <div>Already have an account? <Link to="/login" className="su_link">Login</Link></div>
          </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default Signup;
