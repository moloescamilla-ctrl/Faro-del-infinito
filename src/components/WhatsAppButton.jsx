import { WHATSAPP_NUMBER } from "../data/config.js";
import "./WhatsAppButton.css";

export default function WhatsAppButton() {
  return (
    <a
      className="whatsapp-fab"
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
        <path
          fill="#fff"
          d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.23.6 4.32 1.65 6.12L4 29l8.05-1.6a12 12 0 0 0 3.97.68c6.62 0 12.02-5.4 12.02-12.03C28.04 8.4 22.64 3 16.02 3Zm7.02 17.06c-.3.83-1.5 1.53-2.42 1.72-.63.13-1.45.24-4.23-.9-3.55-1.47-5.83-5.06-6-5.3-.18-.24-1.44-1.92-1.44-3.66 0-1.74.9-2.6 1.23-2.95.3-.34.66-.42.88-.42h.63c.2 0 .48-.08.75.57.3.72 1.02 2.46 1.1 2.64.1.18.16.4.03.64-.13.24-.2.4-.4.6-.2.24-.42.53-.6.7-.2.2-.4.42-.18.82.24.4 1.05 1.73 2.25 2.8 1.55 1.38 2.85 1.82 3.28 2.02.42.2.66.17.9-.1.24-.28 1.03-1.2 1.3-1.6.28-.42.55-.35.9-.2.35.13 2.25 1.06 2.63 1.25.4.2.65.3.75.46.1.18.1 1-.2 1.83Z"
        />
      </svg>
    </a>
  );
}
