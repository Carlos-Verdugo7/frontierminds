export default function GuideMark({ size = 31 }: { size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="7" fill="#2548CC" />
    <g stroke="#FFF9EC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 26l9-16 5 8h8M7 26l14-8 6 9" />
      <circle cx="16" cy="10" r="2" fill="#FFF9EC" /><circle cx="21" cy="18" r="2" fill="#FFF9EC" />
    </g>
  </svg>;
}
