import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import CategoryIcon from "../components/CategoryIcon.jsx";
import useReveal from "../components/useReveal.js";
import { CATEGORIES, FAQ, PRICE_MXN } from "../data/config.js";
import heroSunrise from "../assets/hero-sunrise.jpg";
import "./Landing.css";

export default function Landing() {
  useReveal();

  return (
    <div className="landing">
      <div
        className="page-backdrop"
        style={{ backgroundImage: `url(${heroSunrise})` }}
        aria-hidden="true"
      />

      <section className="hero">
        <Header overlay />
        <div className="container hero__inner">
          <p className="eyebrow eyebrow--light">
            Catálogo digital · pago único ${PRICE_MXN} MXN
          </p>
          <h1 className="hero__title">Un espacio de calma que crece contigo</h1>
          <p className="hero__subtitle">
            Meditaciones guiadas y música binaural grabadas por mí, organizadas
            para acompañarte en cada etapa de tu proceso de conciencia y
            bienestar.
          </p>
          <div className="hero__ctas">
            <Link to="/pago" className="btn-white">
              Quiero mi acceso <span className="btn-white__price">— ${PRICE_MXN} MXN</span>
            </Link>
            <a href="#faq" className="link-ghost">
              Ver preguntas frecuentes
            </a>
          </div>
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow eyebrow--light">Qué incluye tu acceso</p>
            <h2>Cinco caminos, un mismo catálogo</h2>
            <p className="section-head__body">
              Cada pieza está clasificada por intención, para que encuentres
              exactamente lo que tu momento necesita — y no dejes de
              descubrir lo nuevo que se va grabando.
            </p>
          </div>

          <div className="cat-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.key}
                className={cat.wide ? "cat cat--wide reveal" : "cat reveal"}
              >
                <CategoryIcon name={cat.key} />
                <div className="cat__txt">
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-band">
        <div className="container">
          <div className="quote-card reveal">
            <p className="eyebrow eyebrow--light">Comunidad</p>
            <div>
              <blockquote>
                "Al formar parte de la comunidad, puedes sugerir temas para
                nuevas meditaciones — y con el tiempo grabo contenido
                específico para lo que estás trabajando."
              </blockquote>
              <cite>
                Antes de pagar, ya te leemos: tu sugerencia va en el mismo
                formulario de acceso.
              </cite>
            </div>
          </div>
        </div>
      </section>

      <section className="faq" id="faq">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow eyebrow--light">Antes de que te unas</p>
            <h2>Preguntas frecuentes</h2>
          </div>

          <div className="faq-list reveal">
            {FAQ.map(({ q, a }, i) => (
              <details key={q} className="faq-item">
                <summary>
                  <span className="faq-item__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="faq-item__q">{q}</span>
                  <span className="faq-item__chev">+</span>
                </summary>
                <p className="faq-item__a">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="container closing__inner reveal">
          <h2>Tu acceso te espera</h2>
          <p>Pago único de ${PRICE_MXN} MXN · acceso ilimitado y permanente</p>
          <Link to="/pago" className="btn-white">
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
