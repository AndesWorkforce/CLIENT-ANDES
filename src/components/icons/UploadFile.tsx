interface UploadFileProps {
  className?: string;
  onClick?: () => void;
}

export default function UploadFile({ className, onClick }: UploadFileProps) {
  return (
    <svg
      className={className}
      width="35"
      height="35"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <circle cx="12.5" cy="12.5" r="12.5" fill="#0097B2" />
      <g clipPath="url(#clip0_161_384)">
        <path
          d="M18.125 14.375V16.875C18.125 17.2065 17.9933 17.5245 17.7589 17.7589C17.5245 17.9933 17.2065 18.125 16.875 18.125H8.125C7.79348 18.125 7.47554 17.9933 7.24112 17.7589C7.0067 17.5245 6.875 17.2065 6.875 16.875V14.375"
          stroke="#FCFEFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.625 10L12.5 6.875L9.375 10"
          stroke="#FCFEFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 6.875V14.375"
          stroke="#FCFEFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_161_384">
          <rect
            width="15"
            height="15"
            fill="white"
            transform="translate(5 5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
