import {Outlet, Link, useParams } from "react-router-dom";

const PageNotFound = () => {
    const { name } = useParams();

    return (
        <div>
            <p><strong>404 Not Found</strong><br /> The page you requested cannot be found.</p>
            {name && 
                <div>
                    <Link to={`/home/${name}`}>Return to home</Link>
                    <br />
                </div>
            }
            <Link to="/">Return to login</Link>
        </div>
    );
}

export default PageNotFound
