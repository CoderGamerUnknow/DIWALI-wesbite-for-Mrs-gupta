export function Rangoli({ className = "", ...rest }) {
  return (
    <svg
      {...rest}
      className={className}
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="1">
        <circle cx="200" cy="200" r="186" strokeOpacity="0.45" strokeDasharray="2 10" />
        {[30, 54, 78, 102, 126, 150, 174].map((radius) => (
          <circle
            key={radius}
            cx="200"
            cy="200"
            r={radius}
            strokeOpacity={radius % 24 === 0 ? 0.5 : 0.24}
          />
        ))}

        {Array.from({ length: 32 }, (_, index) => (
          <g key={index} transform={`rotate(${index * 11.25} 200 200)`}>
            <ellipse
              cx="200"
              cy="92"
              rx="7.5"
              ry="32"
              strokeOpacity={index % 2 === 0 ? 0.5 : 0.2}
            />
            <circle
              cx="200"
              cy="50"
              r={index % 4 === 0 ? 3.4 : 2.2}
              fill="currentColor"
              stroke="none"
              opacity={index % 2 === 0 ? 0.65 : 0.32}
            />
            <path
              d="M200 168c7 12 11 20 7.5 27-2.4 5-6.4 7-7.5 7s-5.1-2-7.5-7c-3.5-7 .5-15 7.5-27Z"
              strokeOpacity={index % 3 === 0 ? 0.36 : 0.16}
            />
          </g>
        ))}

        <circle cx="200" cy="200" r="13" fill="currentColor" stroke="none" opacity="0.55" />
        <circle cx="200" cy="200" r="6" fill="#07040f" stroke="none" />
      </g>
    </svg>
  );
}
