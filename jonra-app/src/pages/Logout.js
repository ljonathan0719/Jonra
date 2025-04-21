import { useParams } from "react-router-dom";

const Logout = () => {
    const { name } = useParams();

    setTimeout(() => {
        window.location.replace(`http://localhost:5000`);
    }, 1000);

    return (
        <div className="logout-container">
            <h1>Logging Out</h1>
            <p>User {name} has logged out. Redirecting to login page...</p>
        </div>
    );
}

export default Logout;