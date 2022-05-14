import { Row, Col } from "react-grid-system";
import Header from "../utils/Header";
import "../css/Home.css";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import ScrollableFeed from "react-scrollable-feed";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
const domain = process.env.REACT_APP_MY_API;
var socket, selectedChatCompare;
function Home() {
  let [chatId, setChatId] = useState("");

  useEffect(() => {
    localStorage.getItem("access_token") ? <></> : Navigate("/login");
  }, []);
  const [socketConnected, setSocketConnected] = useState(false);
  let Navigate = useNavigate();

  let config = {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  };

  let [userId, setUserId] = useState("");
  useEffect(() => {
    axios.get(`${domain}/api/user/getMyUserId`, config).then((res) => {
      setUserId(res.data);
      axios.get(`${domain}/api/chat/`, config).then((res) => {
        setData(res.data);
      });
    });
  }, []);
  let [search, setSearch] = useState("");
  let [data, setData] = useState([]);
  let [find, setFind] = useState(false);
  let [groupDetails, setGroupDetails] = useState({
    groupName: "",
    groupPhoto: "",
    groupUsers: [],
  });
  let searchUsers = (e) => {
    e.preventDefault();
    axios
      .post(`${domain}/api/user/searchUsers`, { text: search })
      .then((res) => {
        setData(res.data)
        setFind(true);
      })
      .catch((err) => {
      });
  };
  let searchedData = (id) => {
    socket.emit("leave room", chatData.chatId);
    socket.disconnect();
    axios.get(`${domain}/api/user/getMe`, config).then((res) => {
      socket = io(domain);
      socket.emit("setup", res.data);
      socket.on("connected", () => setSocketConnected(true));
    });
    axios.get(`${domain}/api/user/getMyUserId`, config).then((res) => {
      setUserId(res.data);
    });
    axios
      .post(`${domain}/api/chat/createChat`, { userId: id }, config)
      .then((res) => {
        setChatData({
          chatId: res.data._id,
        });
        socket.emit("join chat", res.data._id);
        socket.on("message came", (text) => {
          axios.get(`${domain}/api/chat/`, config).then((res) => {
            setData(res.data);
          });
        });
        setFind(false);
        axios.get(`${domain}/api/user/getMyUserId`, config).then((res) => {
          setUserId(res.data);
          axios.get(`${domain}/api/chat/`, config).then((res) => {
            setData(res.data);
          });
        });
        socket.on("message recieved", (newMessageRecieved) => {
          if (newMessageRecieved) {
            let temp = res.data._id;

            if (newMessageRecieved.chat._id === temp) {
              axios
                .post(`${domain}/api/message/getMessages`, {
                  chatId: newMessageRecieved.chat._id,
                })
                .then((res1) => {
                  setMessages(res1.data);
                });
            }
          }
        });
        axios
          .post(`${domain}/api/message/getMessages`, { chatId: res.data._id })
          .then((res) => {
            setMessages(res.data);
          });
        axios
          .post(`${domain}/api/chat/getChatDetails`, { id: res.data._id })
          .then((res) => {
            setTab(res.data);
          });
      });
  };
  let [tab, setTab] = useState([]);
  let [editGroup, setEditGroup] = useState(false);
  let [chatData, setChatData] = useState({
    chatId: "",
  });
  let [users, setUsers] = useState([
    {
      name: "yaseen ahmed",
      photo: "uploads\\1652337898646istockphoto-911190112-612x612.jpg",
      _id: "1",
    },
    {
      name: "yaseen ahmed",
      photo: "uploads\\1652337898646istockphoto-911190112-612x612.jpg",
      _id: "2",
    },
    {
      name: "yaseen ahmed",
      photo: "uploads\\1652337898646istockphoto-911190112-612x612.jpg",
      _id: "3",
    },
    {
      name: "yaseen ahmed",
      photo: "uploads\\1652337898646istockphoto-911190112-612x612.jpg",
      _id: "4",
    },
    {
      name: "yaseen ahmed",
      photo: "uploads\\1652337898646istockphoto-911190112-612x612.jpg",
      _id: "5",
    },
    {
      name: "yaseen ahmed",
      photo: "uploads\\1652337898646istockphoto-911190112-612x612.jpg",
      _id: "6",
    },
  ]);
  let [selectedUsers, setSelectedUsers] = useState([]);
  let [messages, setMessages] = useState([]);
  const getChatData = (id) => {
    socket.emit("leave room", chatData.chatId);
    socket.disconnect();
    axios.get(`${domain}/api/user/getMe`, config).then((res) => {
      socket = io(domain);
      socket.emit("setup", res.data);
      socket.on("connected", () => setSocketConnected(true));
    });
    axios.get(`${domain}/api/user/getMyUserId`, config).then((res) => {
      setUserId(res.data);
    });
    axios
      .post(`${domain}/api/chat/createChat`, { userId: id }, config)
      .then((res) => {
        setChatId(res.data._id);
        setChatData({
          chatId: res.data._id,
        });
        let temp = res.data._id;

        socket.emit("join chat", res.data._id);
        socket.on("message came", (text) => {
          axios.get(`${domain}/api/chat/`, config).then((res) => {
            setData(res.data);
          });
        });
        socket.on("message recieved", (newMessageRecieved) => {
          if (newMessageRecieved) {
            if (newMessageRecieved.chat._id === temp) {
              axios
                .post(`${domain}/api/message/getMessages`, {
                  chatId: newMessageRecieved.chat._id,
                })
                .then((res1) => {
                  setMessages(res1.data);
                });
            }
          }
        });
        axios
          .post(`${domain}/api/message/getMessages`, { chatId: res.data._id })
          .then((res) => {
            setMessages(res.data);
          });
        axios
          .post(`${domain}/api/chat/getChatDetails`, { id: res.data._id })
          .then((res1) => {
            setTab(res1.data);
          });
      });
    // Navigate(`/home/${id}`)
    // window.location.reload()
  };

  const getGroupData = (id) => {
    socket.emit("leave room", chatData.chatId);
    socket.disconnect();
    axios.get(`${domain}/api/user/getMe`, config).then((res) => {
      socket = io(domain);
      socket.emit("setup", res.data);
      socket.on("connected", () => setSocketConnected(true));

      socket.on("message came", (text) => {
        axios.get(`${domain}/api/chat/`, config).then((res) => {
          setData(res.data);
        });
      });
      socket.on("message recieved", (newMessageRecieved) => {
        if (newMessageRecieved) {
          if (newMessageRecieved.chat._id === id) {
            axios
              .post(`${domain}/api/message/getMessages`, {
                chatId: newMessageRecieved.chat._id,
              })
              .then((res1) => {
                setMessages(res1.data);
              });
          }
        }
      });
    });
    setChatId(id);
    setChatData({
      chatId: id,
    });

    axios.get(`${domain}/api/user/getMyUserId`, config).then((res) => {
      setUserId(res.data);
    });
    socket.emit("join chat", id);

    axios
      .post(`${domain}/api/message/getMessages`, { chatId: id })
      .then((res) => {
        setMessages(res.data);
      });
    axios.post(`${domain}/api/chat/getChatDetails`, { id: id }).then((res1) => {
      setTab(res1.data);
    });
    // Navigate(`/home/${id}`)
    // window.location.reload()
  };

  //send input

  let [message, setMessage] = useState("");

  let messageHandler = (e) => {
    setMessage(e.target.value);
  };
  let sendMessage = (e) => {
    e.preventDefault();
    if (chatData.chatId === "") {
      alert("Choose a chat");
    } else if (message === "") {
      console.log("Message is empty");
    } else {
      axios
        .post(
          `${domain}/api/message/createMessage`,
          { chatId: chatData.chatId, content: message },
          config
        )
        .then((res) => {
          const message = res.data;
          //test
          axios
            .post(`${domain}/api/chat/getChatDetails`, { id: chatData.chatId })
            .then((res1) => {
              let messageData = {
                chat: res1.data,
                message: message,
                myId: userId,
              };
              socket.emit("new message", messageData);
            });

          axios
            .post(`${domain}/api/message/getMessages`, {
              chatId: chatData.chatId,
            })
            .then((res) => {
              setMessages(res.data);
            });
          setMessage("");
        });
    }
  };

  useEffect(() => {
    axios.get(`${domain}/api/user/getMe`, config).then((res) => {
      socket = io(domain);
      socket.emit("setup", res.data);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("message came", (text) => {
        axios.get(`${domain}/api/chat/`, config).then((res) => {
          setData(res.data);
        });
      });
    });
  }, []);

  //modals
  let [groupData, setGroupData] = useState({
    groupName: "",
    groupPhoto: "",
  });
  let changeHandler = (e) => {
    setGroupData({
      ...groupData,
      [e.target.id]: e.target.value,
    });
  };
  let imageChange = (e) => {
    setGroupData({
      ...groupData,
      groupPhoto: e.target.files[0],
    });
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    axios.get(`${domain}/api/user/getAllUsers`).then((res) => {
      var newArray = res.data.filter((item) => item._id !== userId);
      setUsers(newArray);
    });
    setShow(true);
  };
  let createGroup = (e) => {
    e.preventDefault();
    let result = selectedUsers.map((a) => a._id);

    if (groupData.groupName == "") {
      alert("write a groupName");
    } else {
      if (groupData.groupPhoto !== "") {
        if (selectedUsers.length <= 2) {
          alert("Select Min 3 Users");
        } else {
          let formdata = new FormData();
          formdata.append("file", groupData.groupPhoto);

          axios.post(`${domain}/api/user/imageUpload`, formdata).then((res) => {
            axios
              .post(
                `${domain}/api/chat/createGroup`,
                {
                  chatName: groupData.groupName,
                  users: result,
                  groupPhoto: res.data,
                },
                config
              )
              .then((res) => {
                axios.get(`${domain}/api/chat/`, config).then((res) => {
                  setData(res.data);
                });
              });
          });
        }
      } else {
        if (selectedUsers.length <= 2) {
          alert("Add minimum 2 users");
        } else {
          axios
            .post(
              `${domain}/api/chat/createGroup`,
              { chatName: groupData.groupName, users: result },
              config
            )
            .then((res) => {
              axios.get(`${domain}/api/chat/`, config).then((res) => {
                setData(res.data);
              });
            });
        }
      }
    }
    setGroupData({
      groupName: "",
      groupPhoto: "",
    });
    setShow(false);
    setSelectedUsers([]);
  };
  let [remainingUsers, setRemainingUsers] = useState([]);
  let selectUser = (id, name, image) => {
    var newArray = users.filter((item) => item._id !== id);
    setUsers(newArray);

    let newObject = {
      _id: id,
      name: name,
      photo: image,
    };
    selectedUsers.push(newObject);
  };

  let editGroupClose = () => {
    setEditGroup(false);
  };
  let editGroupOpen = (id) => {
    axios.post(`${domain}/api/chat/getChatDetails`, { id: id }).then((res1) => {
      setGroupDetails({
        groupName: res1.data.chatName,
        groupPhoto: res1.data.groupPhoto,
        groupUsers: res1.data.users,
      });
      axios.get(`${domain}/api/user/getAllUsers`).then((res2) => {
        let temp = res2.data;
        for (let i = 0; i < res1.data.users.length; i++) {
          temp = temp.filter((item) => item._id !== res1.data.users[i]._id);
        }
        setRemainingUsers(temp);
      });
    });
    setEditGroup(true);
  };

  let removeUser = (id, chatId) => {
    let temp = groupDetails.groupUsers.filter((item) => item._id !== id);
    axios
      .post(`${domain}/api/chat/removeUser`, { users: temp, chatId: chatId })
      .then((res) => {
        axios
          .post(`${domain}/api/chat/getChatDetails`, { id: chatId })
          .then((res1) => {
            setGroupDetails({
              groupName: res1.data.chatName,
              groupPhoto: res1.data.groupPhoto,
              groupUsers: res1.data.users,
            });
            axios.get(`${domain}/api/user/getAllUsers`).then((res2) => {
              let temp = res2.data;
              for (let i = 0; i < res1.data.users.length; i++) {
                temp = temp.filter(
                  (item) => item._id !== res1.data.users[i]._id
                );
              }
              setRemainingUsers(temp);
            });
          });
      });
  };

  let addUser = (user) => {
    const newEventId = [...groupDetails.groupUsers, user];
    axios
      .post(`${domain}/api/chat/addUser`, { users: newEventId, chatId: chatId })
      .then((res) => {
        axios
          .post(`${domain}/api/chat/getChatDetails`, { id: chatId })
          .then((res1) => {
            setGroupDetails({
              groupName: res1.data.chatName,
              groupPhoto: res1.data.groupPhoto,
              groupUsers: res1.data.users,
            });
            axios.get(`${domain}/api/user/getAllUsers`).then((res2) => {
              let temp = res2.data;
              for (let i = 0; i < res1.data.users.length; i++) {
                temp = temp.filter(
                  (item) => item._id !== res1.data.users[i]._id
                );
              }
              setRemainingUsers(temp);
            });
          });
      });
  };
  return (
    <div>
      <Header />
      <div style={{ height: "calc(100vh - 56px)" }} className="main-background">
        <Row gutterWidth={0}>
          <Col xl={4} className="home_leftDiv">
            <div>
              <button className="createGrpBtn" onClick={handleShow}>
                + Group
              </button>
              <form onSubmit={searchUsers}>
                <input
                  type="text"
                  className="home_search"
                  placeholder="search for users"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
              {find ? (
                data.map((item, i) => {
                  return (
                    <div>
                      <div
                        className="chatUsers"
                        onClick={() => searchedData(item._id)}
                      >
                        <Row>
                          <Col xl={2.5}>
                            <img
                              src={`${domain}/${item.photo}`}
                              className="avatar"
                            />
                          </Col>
                          <Col>
                            <div>
                              <div className="chatName">{item.name}</div>
                              <div className="chatprevtext"></div>
                            </div>
                          </Col>
                        </Row>
                        <hr />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>
                  {data.length === 0 ? (
                    <div style={{ margin: "50px 20px", fontSize: "30px" }}>
                      Search for some users
                    </div>
                  ) : (
                    data.map((item, i) => {
                      return (
                        <>
                          {item.isGroupChat === false ? (
                            item.users.map((user, i) => {
                              return (
                                <>
                                  {user._id !== userId ? (
                                    <div
                                      className="chatUsers"
                                      onClick={() => getChatData(user._id)}
                                    >
                                      <Row>
                                        <Col xl={2.5}>
                                          <img
                                            src={`${domain}/${user.photo}`}
                                            className="avatar"
                                          />
                                        </Col>
                                        <Col>
                                          <div>
                                            <div className="chatName">
                                              {user.name}
                                            </div>
                                            <div className="chatprevtext"></div>
                                          </div>
                                        </Col>
                                      </Row>
                                      <hr />
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              );
                            })
                          ) : (
                            <>
                              {" "}
                              <div
                                className="chatUsers"
                                onClick={() => getGroupData(item._id)}
                              >
                                <Row>
                                  <Col xl={2.5}>
                                    <img
                                      src={`${domain}/${item.groupPhoto}`}
                                      className="avatar"
                                    />
                                  </Col>
                                  <Col>
                                    <div>
                                      <div className="chatName">
                                        {item.chatName}
                                      </div>
                                      <div className="chatprevtext"></div>
                                    </div>
                                  </Col>
                                </Row>
                                <hr />
                              </div>
                            </>
                          )}
                        </>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </Col>
          <Col>
            <div style={{ position: "relative", height: "calc(100vh - 56px)" }}>
              <div className="rightDIvNAv">
                {!tab.isGroupChat && tab.users ? (
                  tab.users.map((item, i) => {
                    return (
                      <>
                        {item._id === userId ? (
                          <></>
                        ) : (
                          <>
                            <img
                              src={`${domain}/${item.photo}`}
                              className="tabImage"
                            />
                            <div className="tagName">{item.name}</div>
                          </>
                        )}
                      </>
                    );
                  })
                ) : (
                  <>
                    {tab.isGroupChat ? (
                      <img
                        src={`${domain}/${tab.groupPhoto}`}
                        className="tabImage"
                      />
                    ) : (
                      <></>
                    )}

                    <div className="tagName">{tab.chatName}</div>
                    {tab.groupAdmin === userId ? (
                      <div
                        style={{ marginLeft: "20px", cursor: "pointer" }}
                        onClick={() => editGroupOpen(tab._id)}
                      >
                        Edit
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </div>
              <div style={{ height: "calc(100vh - 170px)" }}>
                <ScrollableFeed>
                  {messages.map((item, i) => (
                    <div key={i} className="test">
                      {item.sender._id === userId ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "10px 0px",
                            maxWidth: "75%",
                          }}
                        >
                          <img
                            src={`${domain}/${item.sender.photo}`}
                            style={{
                              height: "40px",
                              width: "40px",
                              borderRadius: "20px",
                            }}
                          />
                          <div
                            style={{ marginLeft: "10px" }}
                            className="messageMain1"
                          >
                            <div style={{ color: "white" }}>{`You`}</div>
                            <div>{item.content}</div>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "10px 0px",
                            maxWidth: "75%",
                          }}
                        >
                          <img
                            src={`${domain}/${item.sender.photo}`}
                            style={{
                              height: "40px",
                              width: "40px",
                              borderRadius: "20px",
                            }}
                          />
                          <div
                            style={{ marginLeft: "10px" }}
                            className="messageMain"
                          >
                            <div
                              style={{ color: "white" }}
                            >{`${item.sender.name}`}</div>
                            <div>{item.content}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </ScrollableFeed>
              </div>

              <div className="searchDiv">
                <Row gutterWidth={0}>
                  <Col xl={10} xs={10}>
                    <form onSubmit={sendMessage}>
                      <input
                        type="text"
                        placeholder="Type your message here"
                        className="sendMessageText"
                        value={message}
                        onChange={messageHandler}
                      />
                    </form>
                  </Col>
                  <Col xl={2} xs={2}>
                    <button className="createGrpBtn1" onClick={sendMessage}>
                      Send
                    </button>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {/* //modals */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={createGroup}>
            <div class="form-group mb-1">
              <label for="groupName">Group Name</label>
              <input
                type="text"
                class="form-control"
                id="groupName"
                placeholder="Enter Name"
                value={groupData.groupName}
                onChange={changeHandler}
              />
            </div>
            <div class="form-group mb-1">
              <label for="pic">Group Photo(optional)</label>
              <input
                type="file"
                class="form-control"
                id="pic"
                placeholder="Password"
                onChange={imageChange}
              />
            </div>
            <div class="form-group mb-1">
              <label>Selected Users</label>
              <div>
                {selectedUsers.map((item, id) => {
                  return (
                    <div
                      style={{
                        padding: "8px",
                        borderRadius: "20px",
                        backgroundColor: "skyblue",
                        border: "none",
                        margin: "5px",
                        width: "150px",
                        display: "inline-block",
                      }}
                    >
                      <img
                        src={`${domain}/${item.photo}`}
                        style={{
                          height: "20px",
                          width: "20px",
                          borderRadius: "10px",
                          marginRight: "5px",
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div class="form-group mb-1">
              <label>Add Users</label>
              <div style={{}}>
                {users.map((item, id) => {
                  return (
                    <div
                      onClick={() =>
                        selectUser(item._id, item.name, item.photo)
                      }
                      style={{
                        padding: "8px",
                        borderRadius: "20px",
                        backgroundColor: "skyblue",
                        border: "none",
                        margin: "5px",
                        width: "150px",
                        display: "inline-block",
                      }}
                    >
                      <img
                        src={`${domain}/${item.photo}`}
                        style={{
                          height: "20px",
                          width: "20px",
                          borderRadius: "10px",
                          marginRight: "5px",
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <button type="submit" class="btn btn-primary">
              Submit
            </button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={editGroup} onHide={editGroupClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xl={2}>
              <img
                src={`${domain}/${groupDetails.groupPhoto}`}
                style={{ width: "60px", height: "60px", borderRadius: "30px" }}
              />
            </Col>
            <Col>
              <div
                style={{
                  fontSize: "30px",
                  dislay: "flex",
                  justifyContent: "center",
                }}
              >
                {groupDetails.groupName}
              </div>
            </Col>
          </Row>
          <div>Group Members</div>
          {groupDetails.groupUsers.map((item, i) => {
            return (
              <div>
                <div
                  style={{
                    backgroundColor: "skyblue",
                    padding: "10px",
                    borderRadius: "10px",
                    margin: "10px",
                  }}
                >
                  <img
                    src={`${domain}/${item.photo}`}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "15px",
                    }}
                  />
                  <span style={{ marginLeft: "10px" }}>{item.name}</span>{" "}
                  <span style={{ float: "right", cursor: "pointer" }}>
                    {item._id === userId ? (
                      "(admin)"
                    ) : (
                      <span
                        onClick={() => removeUser(item._id, chatData.chatId)}
                      >
                        X
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
          <div>Add Users</div>
          <div style={{ height: "200px", overflowY: "auto" }}>
            {remainingUsers.map((item, i) => {
              return (
                <div>
                  <div
                    style={{
                      border: "1px solid gray",
                      padding: "10px",
                      borderRadius: "10px",
                      margin: "10px",
                    }}
                  >
                    <img
                      src={`${domain}/${item.photo}`}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "15px",
                      }}
                    />
                    <span style={{ marginLeft: "10px" }}>{item.name}</span>{" "}
                    <span
                      style={{ float: "right", cursor: "pointer" }}
                      onClick={() => {
                        addUser(item);
                      }}
                    >
                      +
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={editGroupClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
