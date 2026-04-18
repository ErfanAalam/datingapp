export function HeartLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lv-heart" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff2e6d" />
          <stop offset="1" stopColor="#b57bff" />
        </linearGradient>
      </defs>
      <path
        d="M24 41s-13.5-8.2-17-16.1C4 18 7.5 10 15 10c4 0 6.8 2 9 5.2C26.2 12 29 10 33 10c7.5 0 11 8 8 14.9C37.5 32.8 24 41 24 41Z"
        fill="url(#lv-heart)"
      />
      <path
        d="M32 18c1.8 0 3 1.5 3 3.2"
        stroke="white"
        strokeOpacity=".6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
