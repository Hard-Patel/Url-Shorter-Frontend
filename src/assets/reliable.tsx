export const ReliableIcon = ({ currentColor }: { currentColor: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="3em"
      height="3em"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke={currentColor}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0M16 6a2 2 0 1 0 4 0a2 2 0 1 0-4 0M7.5 16.5l9-9"
      />
    </svg>
  );
};
