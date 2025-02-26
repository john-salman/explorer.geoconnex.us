export const Hamburger: React.FC = () => {
    return (
        <svg
            width="24"
            height="24"
            className=" text-secondary"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                y="9"
                width="33"
                height="4"
                rx="2"
                stroke="currentColor"
                fill="currentColor"
            />
            <rect
                width="33"
                height="4"
                rx="2"
                stroke="currentColor"
                fill="currentColor"
            />
            <rect
                y="18"
                width="33"
                height="4"
                rx="2"
                stroke="currentColor"
                fill="currentColor"
            />
        </svg>
    );
};
