import { useEffect, useRef, useState } from "react";
import "./AudioPlayer.css";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.5;

    // Los navegadores bloquean el autoplay con sonido salvo excepciones —
    // intentamos igual; si falla, el botón queda listo para que el usuario
    // le dé play con un toque.
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
      .finally(() => setReady(true));
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true));
    }
  }

  return (
    <div className={ready ? "audio-fab" : "audio-fab audio-fab--hidden"}>
      <audio ref={audioRef} src="/audio/meditacion.mp3" loop preload="auto" />
      <button
        type="button"
        className={playing ? "audio-fab__btn is-playing" : "audio-fab__btn"}
        onClick={toggle}
        aria-label={playing ? "Pausar meditación" : "Reproducir meditación"}
        aria-pressed={playing}
      >
        <span className="audio-fab__ring" aria-hidden="true" />
        <span className="audio-fab__bars" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>
  );
}
