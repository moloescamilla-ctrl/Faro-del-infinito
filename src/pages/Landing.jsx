import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { CATALOG_ITEMS, FAQ, PRICE_MXN } from "../data/config.js";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <Header />

      <section className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="container hero__inner">
          <h1 className="hero__title">
            Meditaciones guiadas y música binaural para tu transformación
            interior
          </h1>
          <p className="hero__subtitle">
            Un catálogo en crecimiento, grabado por mí, organizado para
            acompañarte en cada etapa de tu proceso de conciencia y
            bienestar.
          </p>
          <Link to="/pago" className="btn btn-primary hero__cta">
            Quiero mi acceso — pago único ${PRICE_MXN} MXN
          </Link>
        </div>
      </section>

      <section className="catalog">
        <div className="container">
          <p className="eyebrow">Qué incluye</p>
          <ul className="catalog__list">
            {CATALOG_ITEMS.map((item) => (
              <li key={item} className="catalog__item">
                <span className="catalog__dot" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="faq">
        <div className="container">
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2 className="faq__title">Antes de que te unas</h2>
          <div className="faq__list">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="faq__item">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="container closing__inner">
          <h2>Tu acceso te espera</h2>
          <p>
            Pago único de ${PRICE_MXN} MXN, acceso ilimitado y permanente.
          </p>
          <Link to="/pago" className="btn btn-primary">
            Quiero mi acceso
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>Faro del Infinito · Orizaba, México</p>
          <p>@farodelinfinito</p>
        </div>
      </footer>
    </div>
  );
}
