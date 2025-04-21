import {Outlet, Link} from "react-router-dom";

const ErrorPage = () => {

    return (
        <div className="error-container">
            <h1>Error</h1>
            <p className="error-message"><strong>An error has occurred!</strong></p>
            <Link to="/" className="btn btn-primary">Return to login</Link>
        </div>
    );
}

export default ErrorPage