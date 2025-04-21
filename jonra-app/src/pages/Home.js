import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authLogout } from "../api/auth";
import { getBoards, createBoards, deleteBoards } from "../api/boards";
import "./Home.css";

const Home = () => {
    const { name } = useParams();
    const [taskBoards, setTaskBoards] = useState([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [errText, setErrText] = useState("");
    const navigate = useNavigate();

    const handleGetBoards = async () => {
        const res = await getBoards(name);
        const boards = JSON.parse(res.data.boards);
        setTaskBoards(boards);
    }

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (!storedUsername || storedUsername !== name) {
            navigate("/login");
            return;
        }

        const fetchBoards = async () => {
            const res = await getBoards(name);
            const boards = JSON.parse(res.data.boards);
            setTaskBoards(boards);
        };

        fetchBoards();
    }, [name, navigate]);

    const handleCreateBoard = async () => {
        const boardname = prompt("What is this board's name?");
        if (boardname.length === 0) return;
        const res = await createBoards(name, boardname);
        const board = JSON.parse(res.data.board);
        window.location.replace("http://localhost:5000/home/" + name + "/board/" + board[0].pk)
    }

    const handleDeleteBoard = async (boardId) => {
        try {
            const res = await deleteBoards(name, boardId);
            handleGetBoards();
        } catch (err) {
            console.log(err);
            setErrText("Error: Could not delete board!");
        } 
    }

    useEffect(() => {
        handleGetBoards();
    }, []);


    const handleLogout = async () => {
        await authLogout(name);
        localStorage.removeItem("username");
        window.location.href = "/login";
    };

    const handleSettingsClick = (e) => {
        e.preventDefault();
        alert("Settings feature is coming soon!\nYou'll stay on this page ;)");
        setShowProfileMenu(false);
    };

    return (
        <div className="home-container">
            <header className="app-header">
                <h1 className="app-title">Welcome to Jonra!</h1>
                <div className="profile-section">
                    <div
                        className="profile-icon"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    {showProfileMenu && (
                        <div className="profile-dropdown">
                            <div className="profile-info">
                                <span className="username">{name}</span>
                            </div>
                            <a
                                href={`/home/${name}`}
                                className="dropdown-item"
                                onClick={handleSettingsClick}
                            >
                                Settings
                            </a>
                            <button id="logout-button" onClick={handleLogout} className="dropdown-item">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="boards-section">
                <div className="boards-header">
                    <h2>Your Boards</h2>
                    <button
                        onClick={handleCreateBoard}
                        className="create-board-btn"
                    >
                        + New Board
                    </button>
                </div>

                <div className="boards-grid">
                    {taskBoards?.length > 0 ? (
                        taskBoards.map((board) => (
                        <div className="board-card">
                            <Link
                                key={board.pk}
                                to={`/home/${name}/board/${board.pk}`}
                                className="board-card-link"
                            >
                                <div>
                                    <h3>{board.fields.name}</h3>
                                    <p>View tasks →</p>
                                </div>
                            </Link>
                            <button className="delete-button" onClick={() => handleDeleteBoard(board.pk)}>Delete</button>
                        </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>No boards yet. Create your first board!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
