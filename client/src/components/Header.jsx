import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg mb-4 px-4 py-2">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <strong>EZ Share</strong>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link active" aria-current="page" to="/">
              Home
            </Link>
            <Link className="nav-link active" aria-current="page" to="/admin">
              Admin
            </Link>
            <Link className="nav-link active" aria-current="page" to="/user">
              User
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
