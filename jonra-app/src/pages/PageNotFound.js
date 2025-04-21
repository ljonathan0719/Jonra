import {Outlet, Link, useParams } from "react-router-dom";

const PageNotFound = () => {
    const { name } = useParams();

    return (
        <div className="not-found-container">
            <h1>404 Not Found</h1>
            <p>The page you requested cannot be found.</p>
            {name &&
                <Link to={`/home/${name}`} className="btn btn-secondary">Return to home</Link>
            }
            <Link to="/" className="btn btn-primary">Return to login</Link>
        </div>
    );
}

export default PageNotFound