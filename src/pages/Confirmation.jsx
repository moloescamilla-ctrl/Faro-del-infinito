import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "../data/config.js";
import "./Confirmation.css";

export default function Confirmation() {
  return (
    <div className="confirmation">
      <Header />

      <div className="container confirmation__inner">
        <div className="confirmation__badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path
              fill="none"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 12.5l5 5L20 6.5"
            />
          </svg>
        </div>

        <h1>¡Listo! Tu acceso va en camino</h1>

        <p>
          Recibirás un correo de Google con la invitación a tu carpeta de
          meditaciones y música binaural en los próximos minutos. Si no lo
          ves, revisa tu carpeta de spam.
        </p>

        <p>
          Como parte de la comunidad, puedes sugerirme los temas que te
          gustaría que grabe en próximas meditaciones.
        </p>

        <div className="confirmation__support">
          <p>¿Tienes alguna duda o no te llegó el acceso?</p>
          <a
            className="btn btn-secondary"
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
          >
            Escríbenos al {WHATSAPP_DISPLAY}
          </a>
        </div>

        <Link to="/" className="confirmation__back">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
