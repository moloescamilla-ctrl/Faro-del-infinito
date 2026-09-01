import { Link } from "react-router-dom";
import "./Header.css";

export default function Header({ overlay = false }) {
  return (
    <header className={overlay ? "site-header site-header--overlay" : "site-header"}>
      <div className="container site-header__inner">
        <Link to="/" className="brand">
          <svg
            viewBox="0 0 24 32"
            className="brand__mark"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9.5 8h5l2.5 20h-10z" />
            <path d="M8.3 13h7.4M7.6 17.5h8.8" />
            <path d="M9 8V4.5h6V8" />
            <path d="M4 6.5l2.3 1.3M20 6.5l-2.3 1.3" />
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
