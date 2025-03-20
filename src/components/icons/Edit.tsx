interface EditProps {
  className?: string;
  onClick?: () => void;
}

export default function Edit({ className, onClick }: EditProps) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#0097B2"
      onClick={onClick}
    >
      <g clipPath="url(#clip0_599_11255)">
        <path
          d="M10.0835 3.66669H3.66683C3.1806 3.66669 2.71428 3.85984 2.37047 4.20366C2.02665 4.54747 1.8335 5.01379 1.8335 5.50002V18.3334C1.8335 18.8196 2.02665 19.2859 2.37047 19.6297C2.71428 19.9735 3.1806 20.1667 3.66683 20.1667H16.5002C16.9864 20.1667 17.4527 19.9735 17.7965 19.6297C18.1403 19.2859 18.3335 18.8196 18.3335 18.3334V11.9167"
          stroke="#0097B2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.9585 2.29165C17.3232 1.92698 17.8178 1.72211 18.3335 1.72211C18.8492 1.72211 19.3438 1.92698 19.7085 2.29165C20.0732 2.65632 20.278 3.15093 20.278 3.66665C20.278 4.18238 20.0732 4.67698 19.7085 5.04165L11.0002 13.75L7.3335 14.6667L8.25016 11L16.9585 2.29165Z"
          stroke="#0097B2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_599_11255">
          <rect width="22" height="22" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
