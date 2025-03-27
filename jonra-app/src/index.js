import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom"
import App from "./App"
import Board from "./pages/Board"
import Layout from "./pages/Layout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

// export default function App() {
//   return (
//       <BrowserRouter>
//           <Routes>
//               <Route path="/" element ={<Layout />}>
//                   <Route index element={<Home />} />
//                   <Route path ="board" element={<Board />} />
//                   <Route path ="login" element={<Login />} />
//                   <Route path ="signup" element={<Signup />} />
//               </Route>
//           </Routes>
//       </BrowserRouter>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);