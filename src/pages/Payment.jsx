import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import {
  APPS_SCRIPT_URL,
  PAYMENT_METHODS,
  PRICE_MXN,
} from "../data/config.js";
import "./Payment.css";

const IFRAME_NAME = "faro-submit-target";

export default function Payment() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle | sending | error
  const hasSubmittedRef = useRef(false);
  const timeoutRef = useRef(null);

  function handleSubmit() {
    setStatus("sending");
    hasSubmittedRef.current = true;

    // El Apps Script responde dentro del iframe oculto; no podemos leer su
    // contenido (CORS), así que el onLoad del iframe es la señal de "ya
    // llegó respuesta" y navegamos a la confirmación. Si por lo que sea
    // nunca dispara (red caída, Apps Script no configurado), un timeout de
    // respaldo evita dejar al usuario colgado en "enviando...".
    timeoutRef.current = setTimeout(() => {
      if (hasSubmittedRef.current) {
        navigate("/confirmacion");
      }
    }, 15000);
  }

  function handleIframeLoad() {
    if (!hasSubmittedRef.current) return; // ignora el load inicial en blanco
    clearTimeout(timeoutRef.current);
    navigate("/confirmacion");
  }

  return (
    <div className="payment">
      <Header />

      <div className="container payment__layout">
        <div className="payment__intro">
          <p className="eyebrow">Paso 2 de 2</p>
          <h1>Confirma tu acceso — pago único ${PRICE_MXN} MXN</h1>
          <p className="payment__lead">
            Realiza tu pago con cualquiera de estos métodos y después
            completa el formulario para recibir tu acceso.
          </p>

          <div className="method-card">
            <h3>{PAYMENT_METHODS.mercadoPago.label}</h3>
            <dl>
              <div>
                <dt>CLABE</dt>
                <dd>{PAYMENT_METHODS.mercadoPago.clabe}</dd>
              </div>
              <div>
                <dt>Beneficiario</dt>
                <dd>{PAYMENT_METHODS.mercadoPago.beneficiario}</dd>
              </div>
            </dl>
          </div>

          <div className="method-card">
            <h3>OXXO</h3>
            <dl>
              <div>
                <dt>Depósito en efectivo · código</dt>
                <dd>{PAYMENT_METHODS.oxxoEfectivo.codigo}</dd>
              </div>
              <div>
                <dt>Transferencia Spin by OXXO · CLABE</dt>
                <dd>{PAYMENT_METHODS.oxxoSpin.clabe}</dd>
              </div>
            </dl>
          </div>
        </div>

        <form
          className="payment-form"
          action={APPS_SCRIPT_URL}
          method="POST"
          encType="multipart/form-data"
          target={IFRAME_NAME}
          onSubmit={handleSubmit}
        >
          <h2>Envía tu comprobante</h2>

          <label className="field">
            <span>Nombre completo</span>
            <input type="text" name="nombre" required autoComplete="name" />
          </label>

          <label className="field">
            <span>Correo electrónico</span>
            <input
              type="email"
              name="correo"
              required
              autoComplete="email"
              placeholder="aquí llegará tu acceso"
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Monto pagado</span>
              <input
                type="number"
                name="monto"
                required
                min="0"
                step="0.01"
                placeholder={String(PRICE_MXN)}
              />
            </label>

            <label className="field">
              <span>Método utilizado</span>
              <select name="metodo" required defaultValue="">
                <option value="" disabled>
                  Selecciona una opción
                </option>
                <option value="Mercado Pago">Mercado Pago</option>
                <option value="OXXO - efectivo">OXXO — efectivo</option>
                <option value="OXXO - Spin">OXXO — Spin</option>
              </select>
            </label>
          </div>

          <label className="field">
            <span>Comprobante de pago</span>
            <input
              type="file"
              name="comprobante"
              required
              accept="image/*,.pdf"
            />
          </label>

          <label className="field field--suggestion">
            <span>
              Antes de confirmar tu pago, ya queremos escucharte: ¿qué tema
              de meditación te gustaría que grabemos?
            </span>
            <textarea
              name="sugerencia"
              rows={3}
              placeholder="ansiedad, abundancia, sueño profundo…"
            />
            <small>
              Como parte de la comunidad, con el tiempo iremos grabando
              meditaciones para los temas que más se repitan.
            </small>
          </label>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={status === "sending"}
          >
            {status === "sending"
              ? "Enviando…"
              : "Enviar comprobante y recibir mi acceso"}
          </button>

          <p className="payment-form__note">
            En cuanto envíes tu comprobante, recibirás el acceso a tu
            carpeta de meditaciones por correo. Revisamos cada comprobante
            para mantener el proceso seguro para todos.
          </p>
        </form>
      </div>

      <iframe
        name={IFRAME_NAME}
        title="Envío de comprobante"
        onLoad={handleIframeLoad}
        style={{ display: "none" }}
      />
    </div>
  );
}
