import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import RadarChart from "../components/RadarChart.jsx";
import { QUIZ_QUESTIONS, QUIZ_RESULTS, CATEGORIES } from "../data/config.js";
import "./Quiz.css";

const TOTAL = QUIZ_QUESTIONS.length;

function emptyScores() {
  return Object.fromEntries(CATEGORIES.map((c) => [c.key, 0]));
}

function topCategoryKey(scores) {
  return CATEGORIES.reduce((best, cat) =>
    scores[cat.key] > scores[best.key] ? cat : best,
  ).key;
}

function shuffled(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz() {
  const [step, setStep] = useState(0); // 0..TOTAL-1 preguntas, TOTAL = resultado
  const [scores, setScores] = useState(emptyScores);
  const [answered, setAnswered] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const advanceTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(advanceTimeoutRef.current), []);

  const isResult = step >= TOTAL;
  const progress = Math.min(step, TOTAL) / TOTAL;

  function selectOption(key, event) {
    if (selectedKey) return; // ya hay una selección en curso
    event.currentTarget.blur();
    setSelectedKey(key);

    advanceTimeoutRef.current = setTimeout(() => {
      setScores((s) => ({ ...s, [key]: (s[key] || 0) + 1 }));
      setAnswered((a) => [...a, key]);
      setStep((s) => s + 1);
      setSelectedKey(null);
    }, 500);
  }

  function goBack() {
    if (step === 0) return;
    clearTimeout(advanceTimeoutRef.current);
    setSelectedKey(null);
    const lastKey = answered[answered.length - 1];
    setScores((s) => ({ ...s, [lastKey]: s[lastKey] - 1 }));
    setAnswered((a) => a.slice(0, -1));
    setStep((s) => s - 1);
  }

  function restart() {
    clearTimeout(advanceTimeoutRef.current);
    setSelectedKey(null);
    setScores(emptyScores());
    setAnswered([]);
    setStep(0);
  }

  const topKey = isResult ? topCategoryKey(scores) : null;
  const result = topKey ? QUIZ_RESULTS[topKey] : null;

  // Mezcla el orden de las opciones por pregunta, para que la posición
  // del botón no siempre coincida con la misma categoría — así el mapa
  // final no depende de "elegir siempre la primera opción".
  const options = useMemo(
    () => (isResult ? [] : shuffled(QUIZ_QUESTIONS[step].options)),
    [step, isResult],
  );

  return (
    <div className="quiz">
      <Header />
      <div className="container quiz__layout">
        {!isResult && (
          <>
            <div className="quiz__progress">
              <div className="quiz__progress-track">
                <div
                  className="quiz__progress-fill"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="quiz__progress-label">
                Pregunta {step + 1} de {TOTAL}
              </p>
            </div>

            <div className="quiz__question">
              <h1>{QUIZ_QUESTIONS[step].q}</h1>
              <div className="quiz__options">
                {options.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    className={
                      selectedKey === opt.key
                        ? "quiz__option quiz__option--selected"
                        : "quiz__option"
                    }
                    disabled={Boolean(selectedKey)}
                    onClick={(e) => selectOption(opt.key, e)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button type="button" className="quiz__back" onClick={goBack}>
                  ← Regresar
                </button>
              )}
            </div>
          </>
        )}

        {isResult && (
          <div className="quiz__result">
            <p className="eyebrow">Tu resultado</p>
            <h1>{result.headline}</h1>
            <p className="quiz__result-body">{result.body}</p>

            <div className="quiz__radar-wrap">
              <RadarChart scores={scores} topKey={topKey} />
            </div>

            <div className="quiz__result-ctas">
              <Link to="/pago" className="btn btn-primary">
                Quiero mi meditación de {CATEGORIES.find((c) => c.key === topKey).name.toLowerCase()}
              </Link>
              <button type="button" className="quiz__retry" onClick={restart}>
                Volver a hacer el test
              </button>
            </div>

            <p className="quiz__result-note">
              Tu acceso incluye el catálogo completo — las cinco categorías,
              no solo esta. Este resultado es tu punto de partida.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
