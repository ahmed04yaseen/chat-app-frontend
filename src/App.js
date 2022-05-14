import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './utils/Header';
import "./css/All.css"
import Signup from './components/Signup';
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';

function App() {
  return (
    <div className='main-background'>
      <Router>
        <Routes>
        <Route index element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="home" element={<Home />}>
          
        </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
