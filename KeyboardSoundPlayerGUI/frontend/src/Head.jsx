import "./App.css"
import "./assets/bootstrap"
import {Link} from "react-router-dom";

function Head(props) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container px-5">
                <Link className="navbar-brand" to="/">{props.name}</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/></button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/keys">Key Mapping</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/config">Config</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Head
