import logo from "./assets/logo.png";

export default function Header() {
  return (
    <nav className="navbar bg-light mb-4 p-0">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="Logo" className="mr-2" />
          <div>EZ Share</div>
        </a>
      </div>
    </nav>
  );
}
