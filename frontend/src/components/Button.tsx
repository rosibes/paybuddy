export interface ButtonProps {
    variant: "primary" | "secondary";
    size: "sm" | "md" | "lg";
    text: string;
    onClick?: () => void;
    width?: "auto" | "full" | "lg" | "md";
}

const variantStyle = {
    "primary": "bg-black text-white",
    "secondary": "bg-gray-300 text-write-600"
}

const defaultStyles = "rounded-md flex cursor-pointer justify-center text-xl"

const sizeStyles = {
    "sm": "py-2 px-3",
    "md": "py-3 px-5",
    "lg": "py-4 px-7"
}

const widthStyles = {
    "auto": "w-auto",
    "full": "w-full",
    "lg": "w-[400px]",
    "md": "w-[250px]",
};

export const Button = ({ variant, size, text, onClick, width }: ButtonProps) => {
    return <button onClick={onClick}
        className={` ${defaultStyles} ${variantStyle[variant]} ${sizeStyles[size]} ${widthStyles[width || "auto"]}`}>
        {text}
    </button>
}