export default function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="univaGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5B8CFF" />
          <stop offset="55%" stopColor="#2DD4C6" />
          <stop offset="100%" stopColor="#9C8CFF" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#univaGrad)" />
      {[[16, 8], [16, 24], [8, 16], [24, 16]].map(([x, y], i) => (
        <line key={i} x1="16" y1="16" x2={x} y2={y} stroke="#0D111C" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
      ))}
      <circle cx="16" cy="16" r="2.6" fill="#0D111C" />
      {[[16, 8], [16, 24], [8, 16], [24, 16]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.7" fill="#0D111C" />
      ))}
    </svg>
  );
}