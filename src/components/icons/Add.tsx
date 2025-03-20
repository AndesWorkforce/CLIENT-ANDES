interface AddProps {
  className?: string;
  onClick?: () => void;
}

export default function Add({ className, onClick }: AddProps) {
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
      <path
        d="M18.5 12.75H7"
        stroke="#FCFEFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 7V18.5"
        stroke="#FCFEFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
