import { useContext } from "react";
import { Link } from "react-router-dom";
import UserAccessProvider from "../contexts/UserAccessProvider";

function Home() {
  const { setUserType } = useContext(UserAccessProvider);
  return (
    <div className="home">
      <h1>Where do you want to go?</h1>
      <div className="d-flex justify-content-evenly">
        <Link
          to="/admin"
          className="btn btn-primary"
          onClick={() => setUserType("admin")}
        >
          Admin
        </Link>
        <Link
          to="/upload"
          className="btn btn-primary"
          onClick={() => setUserType("user")}
        >
          User
        </Link>
      </div>
    </div>
  );
}

export default Home;
