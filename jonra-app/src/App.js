import axios from 'axios';
import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom"
import board from "/pages/board"
import layout from "/pages/layout"
import homepage from "/pages/homepage"
import login from "/pages/login"
import signup from "/pages/signup"

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element = {<layout />}>
                  <Route index element= {<homepage />} />
                  <Route path = "board" element= {<board />} />
                  <Route path = "login" element= {<login />} />
                  <Route path = "signup" element= {<signup />} />
              </Route>
          </Routes>
      </BrowserRouter>
  );
}

// class App extends React.Component {
//
//   state = { details: [], }
//
//   componentDidMount() {
//
//     let data;
//     axios.get('http://localhost:8000/home/jonathan')
//         .then(res => {
//           data = res.data;
//           this.setState({
//             details: data
//           })
//         })
//         .catch(err => { })
//   }
//
//
//   render() {
//     return (
//       <div>
//           <div>
//               <h2>Username</h2>
//               <b>{this.state.details["Username"]}</b>
//               <h2>Available Boards</h2>
//               <b>{this.state.details["Available Boards"]}</b>
//           </div>
//       </div>
//     )
//   }
// }

const root = ReactDOM.createRoot(document.getElementById('root'))
export default App;
