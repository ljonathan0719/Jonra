import { useParams, useNavigate } from "react-router-dom";

// Temporary page to logout the user
const Logout = () => {
    const { name } = useParams();
    const navigate = useNavigate();

    setTimeout(() => {
        // window.location.replace(`http://localhost:5000`);
        navigate("/login");
    }, 1000);

    return (
        <div className="logout-container">
            <h1>Logging Out</h1>
            <p>User {name} has logged out. Redirecting to login page...</p>
        </div>
    );
}

export default Logout;