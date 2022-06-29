import "./assets/App.css"
import "./assets/bootstrap"
import {Link} from "react-router-dom";
import {BrowserOpenURL} from "../wailsjs/runtime";

function Head(props) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container px-5">
                <span className="navbar-brand">{props.name}</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/></button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/keys">Key Mapping</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/config">Config</Link></li>
                        <li className="nav-item"><a className="nav-link" onClick={() => {
                            BrowserOpenURL("https://jgltechnologies.com/KeyboardSoundPlayer")
                        }}>Documentation</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Head
