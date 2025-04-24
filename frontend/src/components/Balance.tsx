import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Text } from "./Text"
import { Button } from "./Button";

export const Balance = ({ value }: { value: string }) => {
    const { logout } = useAuth();
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        navigate("/signin");
    };

    return (
        <div className="h-14 flex items-center p-4 gap-4">
            <div className="flex justify-between w-full">
                <div className="flex gap-2 items-center">
                    <Text text="Your Balance" size="lg" style="bold" color="black" />
                    <Text text={`$${value}`} size="lg" style="bold" color="black" />
                </div>
                <div className="p-2 mt-1">
                    <Button text="Logout" variant="secondary" onClick={handleLogout} size="sm" />
                </div>
            </div>
        </div>
    );
};