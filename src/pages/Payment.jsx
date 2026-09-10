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

  const [mpForm, setMpForm] = useState({ nombre: "", correo: "", sugerencia: "" });
  const [mpStatus, setMpStatus] = useState("idle"); // idle | redirecting | error

  async function handleMpSubmit(event) {
    event.preventDefault();
    setMpStatus("redirecting");

    try {
      const body = new URLSearchParams({
        action: "crear_preferencia_mp",
        nombre: mpForm.nombre,
        correo: mpForm.correo,
        sugerencia: mpForm.sugerencia,
      });

      const res = await fetch(APPS_SCRIPT_URL, { method: "POST", body });
      const data = await res.json();

      if (!data.checkoutUrl) {
        throw new Error(data.error || "No se recibió la URL de pago");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
      setMpStatus("error");
    }
  }

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
            Paga directo con tarjeta o en OXXO a través de Mercado Pago, o si
            prefieres, transfiere manualmente con los datos de abajo.
          </p>

          <form className="mp-card" onSubmit={handleMpSubmit}>
            <p className="mp-card__badge">Recomendado · acceso inmediato</p>
            <h3>Pagar con Mercado Pago</h3>
            <p className="mp-card__note">
              Tarjeta de crédito/débito o efectivo en OXXO. Tu acceso se
              activa automáticamente en cuanto Mercado Pago confirma el pago.
            </p>

            <label className="field">
              <span>Nombre completo</span>
              <input
                type="text"
                required
                autoComplete="name"
                value={mpForm.nombre}
                onChange={(e) => setMpForm({ ...mpForm, nombre: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Correo electrónico</span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="aquí llegará tu acceso"
                value={mpForm.correo}
                onChange={(e) => setMpForm({ ...mpForm, correo: e.target.value })}
              />
            </label>

            <label className="field">
              <span>¿Qué tema de meditación te gustaría que grabemos? (opcional)</span>
              <input
                type="text"
                placeholder="ansiedad, abundancia, sueño profundo…"
                value={mpForm.sugerencia}
                onChange={(e) => setMpForm({ ...mpForm, sugerencia: e.target.value })}
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={mpStatus === "redirecting"}
            >
              {mpStatus === "redirecting"
                ? "Redirigiendo a Mercado Pago…"
                : `Pagar $${PRICE_MXN} MXN con Mercado Pago`}
            </button>

            {mpStatus === "error" && (
              <p className="mp-card__error">
                No pudimos conectar con Mercado Pago. Intenta de nuevo o usa
                el pago manual de abajo.
              </p>
            )}
          </form>

          <p className="divider-label">o transfiere manualmente</p>

          <div className="method-card">
            <h3>{PAYMENT_METHODS.mercadoPago.label}</h3>
            <dl>
              <div>
                <dt>CLABE</dt>
                <dd>{PAYMENT_METHODS.mercadoPago.clabe}</dd>
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
