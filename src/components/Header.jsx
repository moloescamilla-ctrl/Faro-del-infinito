import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand">
          <svg viewBox="0 0 40 40" className="brand__mark" aria-hidden="true">
            <circle cx="20" cy="20" r="19" fill="#2a2440" />
            <circle cx="20" cy="15" r="6.2" fill="#f3b65e" />
            <path d="M13 35 L16.5 21 L23.5 21 L27 35 Z" fill="#f8f4ec" />
          </svg>
          <span className="brand__word">Faro del Infinito</span>
        </Link>
        <Link to="/pago" className="btn btn-primary header-cta">
          Quiero mi acceso
        </Link>
      </div>
    </header>
  );
}
