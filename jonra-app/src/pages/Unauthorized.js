import {Outlet, Link} from "react-router-dom";

export default Unauthorized = () => {
    return (
        <div>
            <p><strong>Unauthorized action</strong>: You do not have permission to access this resource!</p>
            <Link to="/">Return to login</Link>
        </div>
    );
}
