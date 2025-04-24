import { Link } from "react-router-dom";

interface BottomWarningProps {
    label: string;
    buttonText: string;
    to: string;
}

export function BottomWarning({ label, buttonText, to }: BottomWarningProps) {
    return (
        <div className="py-2 text-sm flex justify-center">
            <div>{label}</div>
            <Link className="pl-1 underline cursor-pointer" to={to}>
                {buttonText}
            </Link>
        </div>
    );
}
