import { Link } from "react-router-dom";
import logo from "../components/assets/logo.png";

function Home() {
  return (
    <div className="home">
      <h1>Where do you want to go?</h1>
      <div className="d-flex justify-content-evenly">
        <Link to="/admin" className="btn btn-primary">
          Admin
        </Link>
        <Link to="/user" className="btn btn-primary">
          User
        </Link>
      </div>
    </div>
  );
}

export default Home;
