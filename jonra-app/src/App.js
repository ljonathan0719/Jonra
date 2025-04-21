import React from "react";
import {Routes, Route} from "react-router-dom"
import Board from "./pages/Board"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ErrorPage from "./pages/Error"
import PageNotFound from "./pages/PageNotFound"
import Logout from "./pages/Logout"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/">
          <Route index element={<Login/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="signup" element={<Signup/>}/>
          <Route path="home/:name/">
            <Route index element={<Home />}/>
            <Route path="board/:id" element={<Board />}>
              <Route path="edit/" element={<Board />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Route>
          <Route path="logout/:name" element={<Logout />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
