import React, { useEffect, useState } from "react";


const Home = () => {
    const [taskBoards, setTaskBoards] = useState([]);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        // Figure out how to fetch json response to list existing task boards
        fetch("/api/task-boards")
            .then((response) => response.json())
            .then((data) => setTaskBoards(data))
            .catch((error) => console.error("Error fetching task boards:", error));
    }, []);


    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "20px" }}>
            {/* Top Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Welcome to Jonra</h1>
                <div style={{ position: "relative" }}>
                    <img
                        src="/path-to-profile-pic.jpg"
                        alt="Profile"
                        style={{ width: 40, height: 40, borderRadius: "50%", cursor: "pointer" }}
                        onClick={() => setShowMenu(!showMenu)}
                    />
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
                    {taskBoards.length > 0 ? (
                        <ul>
                            {taskBoards.map((board) => (
                                <li key={board.id}>{board.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No task boards available.</p>
                    )}
                </div>

                {/* Create Task Board Section */}
                <div style={{ width: "40%", border: "1px solid #ddd", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
                    <h2>Create a New Task Board</h2>
                    <button onClick={() => alert("Create Board Clicked")}>Create Board</button>
                </div>
            </div>
        </div>
    )
};

export default Home;