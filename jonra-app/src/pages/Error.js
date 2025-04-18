import {Outlet, Link} from "react-router-dom";

const ErrorPage = () => {

    return (
        <div>
            <p><strong>An error has occurred!</strong></p>
            <Link to="/">Return to login</Link>
        </div>
    );
}

export default ErrorPage
