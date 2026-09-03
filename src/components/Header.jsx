import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Header.css";

export default function Header({ overlay = false }) {
  return (
    <header className={overlay ? "site-header site-header--overlay" : "site-header"}>
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="Faro del Infinito — inicio">
          {overlay ? (
            <img src={logo} alt="Faro del Infinito" className="brand-logo" />
          ) : (
            <span className="brand__word">Faro del Infinito</span>
          )}
        </Link>
        {overlay ? (
          <Link to="/pago" className="navcta">
            Quiero mi acceso
          </Link>
        ) : (
          <Link to="/pago" className="btn btn-primary header-cta">
            Quiero mi acceso
          </Link>
        )}
      </div>
    </header>
  );
}
