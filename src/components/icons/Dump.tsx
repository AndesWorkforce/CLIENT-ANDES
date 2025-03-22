interface DumpProps {
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
}

export default function Dump({ className, onClick }: DumpProps) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M2.75 5.5H4.58333H19.25"
        stroke="#0097B2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.3335 5.49998V3.66665C7.3335 3.18042 7.52665 2.7141 7.87047 2.37028C8.21428 2.02647 8.6806 1.83331 9.16683 1.83331H12.8335C13.3197 1.83331 13.786 2.02647 14.1299 2.37028C14.4737 2.7141 14.6668 3.18042 14.6668 3.66665V5.49998M17.4168 5.49998V18.3333C17.4168 18.8195 17.2237 19.2859 16.8799 19.6297C16.536 19.9735 16.0697 20.1666 15.5835 20.1666H6.41683C5.9306 20.1666 5.46428 19.9735 5.12047 19.6297C4.77665 19.2859 4.5835 18.8195 4.5835 18.3333V5.49998H17.4168Z"
        stroke="#0097B2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.1665 10.0833V15.5833"
        stroke="#0097B2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.8335 10.0833V15.5833"
        stroke="#0097B2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
