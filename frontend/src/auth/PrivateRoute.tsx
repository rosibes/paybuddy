import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Spinner } from "../components/Spinner";

export const PrivateRoute = ({ children }: { children: any }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Spinner />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/signin" />;
    }

    return children;
};
