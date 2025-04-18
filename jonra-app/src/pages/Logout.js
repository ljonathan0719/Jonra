import { useParams } from "react-router-dom";

const Logout = () => {
    const { name } = useParams();
    console.log("logout name: ", name)
    setTimeout(() => {
        window.location.replace(`http://localhost:5000`)
    }, 1000);
    return (
        <div>
            <p>User {name} has logged out. Redirecting to login page...</p>
        </div>
    );
}

export default Logout;
