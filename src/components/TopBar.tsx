interface Props {
  ambientOn: boolean;
  onToggleAmbient: () => void;
  onReveal: () => void;
  revealed: boolean;
}

/**
 * The only chrome on the habitat: a wordmark and three icon buttons, sitting
 * directly on the image. Nothing here opens a screen.
 */
export default function TopBar({
  ambientOn,
  onToggleAmbient,
  onReveal,
  revealed,
}: Props) {
  const requestFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  };

  return (
    <>
      <div className="wordmark">
        <span className="wordmark__text">ARES</span>
      </div>

      <nav className="tools" aria-label="Habitat controls">
        <button
          type="button"
          className={`tool${revealed ? ' is-on' : ''}`}
          onClick={onReveal}
          aria-pressed={revealed}
          title="Reveal structures"
        >
          <span className="sr-only">Reveal structures</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M3 20h18M6 20V11l6-5 6 5v9M10 20v-5h4v5" />
          </svg>
        </button>

        <button
          type="button"
          className={`tool${ambientOn ? ' is-on' : ''}`}
          onClick={onToggleAmbient}
          aria-pressed={ambientOn}
          title={ambientOn ? 'Still the habitat' : 'Let the habitat drift'}
        >
          <span className="sr-only">{ambientOn ? 'Still the habitat' : 'Let the habitat drift'}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M3 9h11a3 3 0 1 0-3-3M3 15h14a3 3 0 1 1-3 3M3 12h18" />
          </svg>
        </button>

        <button type="button" className="tool" onClick={requestFullscreen} title="Fill the screen">
          <span className="sr-only">Fill the screen</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>
      </nav>
    </>
  );
}
