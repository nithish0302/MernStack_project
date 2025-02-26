import "../Header.css";
import logo from "../assets/logo.avif";

export default function Header() {
  return (
    <>
      <div className="header-container">
        <div className="image-manage">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <button className="home">Home</button>
        <button className="car">Car</button>
        <button className="bike">Bike</button>
        <button className="contact">Contact</button>
        <button className="aboutus">About Us</button>
        <button className="signin">Sign in</button>
      </div>
    </>
  );
}
