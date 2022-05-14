import React, {useEffect, useState} from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Row, Col } from "react-grid-system";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {Modal, Button} from "react-bootstrap"
import Avatar from "../images/avatar.png";
import axios from "axios";
const domain = process.env.REACT_APP_MY_API;

function Header() {
  let [myData, setMyData] = useState({})
  let config = {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  };
  
  useEffect(()=>{
    axios.get(`${domain}/api/user/getMe`, config).then(res=>{
setMyData(res.data)
    })
  },[])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {

    setShow(true)
  };
  let navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const home = () =>{
    navigate("/home")
  }
  return (
    <>
    <Navbar bg="dark" variant="dark">
      <Container>
        <div style={{color: "white", fontSize: "26px", cursor:"pointer"}} onClick={home}>Karmaa Labs</div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
         
        </Navbar.Collapse>
        {localStorage.getItem("access_token") ? (
          <div>
            <div
              style={{ color: "white", float: "right", cursor: "pointer" }}
              onClick={logout}
            >
              Logout
            </div>
            <div
              style={{
                color: "white",
                float: "right",
                cursor: "pointer",
                marginRight: "10px",
              }}
              onClick={handleShow}
            >
              My Account
            </div>
          </div>
        ) : (
          <div>
            <NavLink to={`/signup`}>
              <div
                style={{
                  color: "white",
                  float: "right",
                  cursor: "pointer",
                }}
              >
                SignUp
              </div>
            </NavLink>
            <NavLink to={`/login`}>
              <div
                style={{
                  color: "white",
                  float: "right",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Login
              </div>
            </NavLink>
          </div>
        )}
      </Container>
    </Navbar>
     <Modal show={show} onHide={handleClose}>
     <Modal.Header closeButton>
       <Modal.Title>My Account</Modal.Title>
     </Modal.Header>
     <Modal.Body>
       <Row>
         <Col xl={2}>
           <img src={`${domain}/${myData.photo}`} style={{width:"50px", borderRadius:"25px"}} />
         </Col>
         <Col>
         <div>{myData.name}</div>
         <div>{myData.email}</div>
         </Col>
       </Row>
     </Modal.Body>
     <Modal.Footer>
       <Button variant="secondary" onClick={handleClose}>
         Close
       </Button>
       
     </Modal.Footer>
   </Modal>
   </>
  );
}

export default Header;
