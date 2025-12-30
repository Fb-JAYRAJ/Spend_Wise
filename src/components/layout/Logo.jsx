export default function Logo() {
  return (
    <div className="w-[250px] transition hover:scale-[1.03]">
      <svg
        viewBox="0 0 460 130"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}>
        {/* Icon */}
        <g transform="translate(20, 28)">
          <circle
            cx="30"
            cy="30"
            r="28"
            className="fill-emerald-300 dark:fill-emerald-700 opacity-30"
          />

          <circle
            cx="30"
            cy="30"
            r="24"
            className="fill-emerald-400 dark:fill-emerald-600"
          />

          {/* Dollar + arrow */}
          <path
            d="M 32 18 L 32 44 
               M 28 22 Q 28 20 30 20 L 34 20 Q 36 20 36 22 Q 36 24 34 24 L 30 24 
               M 30 28 L 34 28 Q 36 28 36 30 Q 36 32 34 32 L 30 32 
               Q 28 32 28 34 Q 28 36 30 36 
               L 34 36 Q 36 36 36 38"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          <g opacity="0.95">
            <path
              d="M 14 42 L 25 30 L 36 36 L 48 22"
              stroke="white"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <polyline
              points="40,21 48,22 47,30"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* Text */}
        <g transform="translate(115, 55)">
          <text
            x="0"
            y="0"
            fontFamily="Arial, sans-serif"
            fontSize="38"
            fontWeight="800"
            fill="currentColor">
            Spend
            <tspan fill="#34d399">Wise</tspan>
          </text>

          <text
            x="2"
            y="28"
            fontFamily="Arial, sans-serif"
            fontSize="13"
            fontWeight="500"
            fill="#6b7280"
            letterSpacing="1.5">
            SMART MONEY MANAGEMENT
          </text>
        </g>
      </svg>
    </div>
  );
}
