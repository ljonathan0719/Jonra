import axios from 'axios';
import React from "react";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Welcome to the Jonra Homepage!
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           React Reference
//         </a>
//       </header>
//     </div>
//   );
// }

class App extends React.Component {

  state = { details: [], }

  componentDidMount() {

    let data;
    axios.get('http://localhost:8000/home/jonathan')
        .then(res => {
          data = res.data;
          this.setState({
            details: data
          })
        })
        .catch(err => { })
  }


  render() {
    return (
      <div>
          <div>
              <h2>Username</h2>
              <b>{this.state.details["Username"]}</b>
              <h2>Available Boards</h2>
              <b>{this.state.details["Available Boards"]}</b>
          </div>
      </div>
    )
  }
}

export default App;
