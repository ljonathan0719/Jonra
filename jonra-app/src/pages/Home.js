import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authLogout } from "../api/auth";
import { getBoards, createBoards, deleteBoards } from "../api/boards";
import { verifyUser } from "../api/auth";
import "./Home.css";

/*
 * Responsible for displaying the boards
 * Able to go to the Board page and delete boards from given list
 */
const Home = () => {
    const { name } = useParams();
    const [taskBoards, setTaskBoards] = useState([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [errText, setErrText] = useState("");
    const navigate = useNavigate();

    // Verifies if user matches one stored locally
    const checkUser = () => {
        const validUser = verifyUser(name);
        if (!validUser) navigate("/authError");
    }

    // Acquire the boards
    const handleGetBoards = async () => {
        try {
            const res = await getBoards(name);
            const boards = JSON.parse(res.data.boards);
            setTaskBoards(boards);
        } catch (err) {

        }
    }

    // Verify the user based on locally stored data
    useEffect(() => {
        checkUser();
        handleGetBoards();
    }, [name, navigate]);

    // Create the board using a window prompt
    const handleCreateBoard = async () => {
        const boardname = prompt("What is this board's name?");
        if (boardname.length === 0) return;
        const res = await createBoards(name, boardname);
        const board = JSON.parse(res.data.board);
        navigate(`board/${board[0].pk}`);
    }

    // Delete the board with given ID and update the page
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
        checkUser();
        handleGetBoards();
    }, []);

    // Logout the user
    const handleLogout = async () => {
        await authLogout(name);
        localStorage.removeItem("username");
        navigate("/login");
    };

    // Show settings option when user clicks the option on the user icon
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
