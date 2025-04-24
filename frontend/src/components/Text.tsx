export interface TextProps {
    text: string,
    style?: 'bold' | 'regular'
    size?: 'sm' | 'md' | 'lg' | '2xl' | '3xl' | '4xl'
    color?: 'white' | 'gray' | 'black' | 'primary';
    align?: 'left' | 'center' | 'right';
    className?: string;
}

const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",

};

const textStyles = {
    "bold": "font-bold",
    "regular": "font-normal",
}

const colorStyles = {
    white: "text-white",
    gray: "text-gray-500",
    black: "text-black",
    primary: "text-blue-600",
};

const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

export const Text = ({ text, size, color, align, className, style }: TextProps) => {
    return <div className={`${sizeStyles[size || 'md']} ${colorStyles[color || 'black']} ${alignStyles[align || 'left']} ${className || ''} ${textStyles[style || 'regular']}`}>
        {text}
    </div>
}