const ICONS = {
  relajacion: (
    <>
      <path d="M4 15c2-6 6-9 8-9s6 3 8 9" />
      <path d="M2 19h20" />
    </>
  ),
  enfoque: (
    <>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
  abundancia: <path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5" />,
  sanacion: (
    <path d="M12 21s-7-4.4-9.5-9C.7 8 3 4 7 4c2 0 4 1.4 5 3 1-1.6 3-3 5-3 4 0 6.3 4 4.5 8-2.5 4.6-9.5 9-9.5 9Z" />
  ),
  expansion: (
    <>
      <path d="M12 2v3M12 19v3M4.2 4.2l2 2M17.8 17.8l2 2M2 12h3M19 12h3M4.2 19.8l2-2M17.8 6.2l2-2" />
      <circle cx="12" cy="12" r="4.5" />
    </>
  ),
};

export default function CategoryIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}
