import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { authLogout } from "../api/auth";


const { 
    getBoards, 
    createBoards,
    editBoard,
    deleteBoards  } = require("../api/boards");

const { userLogout } = require("../api/users")

const Home = () => {
    const { name } = useParams();
    const [taskBoards, setTaskBoards] = useState([]);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const handleGetBoards = async (username) => {
            const res = await getBoards(username);
            const boards = JSON.parse(res.data.boards);
            setTaskBoards(boards);
        }

        handleGetBoards(name);
    }, [name]);

    const handleCreateBoard = async () => {
        const boardname = prompt("What is this board's name?");
        if (boardname.length === 0) return;
        const res = await createBoards(name, boardname);
        const board = JSON.parse(res.data.board);
        window.location.replace("http://localhost:5000/home/" + name + "/board/" + board[0].pk)
    }

    const handleLogout = async () => {
        const res = await authLogout(name);
        console.log(res);
        if (res.status === 200 && res.message !== "Already logged out") {
            window.location.replace(`http://localhost:5000/logout/${name}`)
        };
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "20px" }}>
            {/* Top Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Welcome to Jonra</h1>
                <div style={{ position: "relative" }}>
                    {/* <img
                        src="/path-to-profile-pic.jpg"
                        alt="Profile"
                        style={{ width: 40, height: 40, borderRadius: "50%", cursor: "pointer" }}
                        onClick={() => setShowMenu(!showMenu)}
                    /> */}
                    {showMenu && (
                        <div style={{ position: "absolute", right: 0, background: "white", border: "1px solid #ddd", borderRadius: 5, padding: 10 }}>
                            <p style={{ margin: "5px 0", cursor: "pointer" }}>Info</p>
                            <p style={{ margin: "5px 0", cursor: "pointer" }}>Settings</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Task Boards Section */}
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
                {/* Existing Task Boards */}
                <div style={{ width: "40%", border: "1px solid #ddd", padding: "20px", borderRadius: "10px" }}>
                    <h2>Existing Task Boards</h2>
                        {taskBoards ? taskBoards.map((board) => (
                            <div>
                                <Link to={`board/${board.pk}`}>{board.fields.name}</Link>
                            </div>
                        )) : <p>No boards</p>}
                </div>

                {/* Create Task Board Section */}
                <div style={{ width: "40%", border: "1px solid #ddd", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
                    <h2>Create a New Task Board</h2>
                    <form>
                        <p>Enter board name: <input type="text" name=""></input></p>
                        <button onClick={handleCreateBoard}>Create Board</button>
                    </form>
                </div>
            </div>
            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
};

export default Home;
