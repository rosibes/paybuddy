import { useRef, useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../auth/AuthContext";

export const Signup = () => {
    const { setUser } = useAuth();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const signup = async () => {

        try {
            setIsLoading(true);
            const username = usernameRef.current?.value;
            const password = passwordRef.current?.value;
            const firstName = firstNameRef.current?.value;
            const lastName = lastNameRef.current?.value;

            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
                username,
                password,
                lastName,
                firstName
            });

            //@ts-ignore
            const jwt = response.data?.token;
            localStorage.setItem("token", jwt);
            //@ts-ignore
            localStorage.setItem("userId", response.data?.userId);

            // 👇 Aici iei datele utilizatorului curent
            const meResponse = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });

            setUser(meResponse.data);
            toast.success("Signed up successfully!");
            navigate('/dashboard');
        } catch (e: any) {
            const message = e?.response?.data?.message || "Sign up failed!";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="bg-slate-400 min-h-screen flex items-center justify-center">
            <div className="w-100 h-auto flex justify-center bg-white rounded-lg shadow">
                <div className="p-6 flex flex-col ">
                    <Heading label="Sign Up" className="text-center" align="center" style="bold" />
                    <Heading label="Enter your information to create an account" size="lg" align="center" className="text-center" />
                    <div className="mt-3">
                        <Input reference={firstNameRef} label="First Name" placeholder="John" className="mt-1 mb-1" />
                        <Input reference={lastNameRef} label="Last Name" placeholder="Doe" className="mt-1 mb-1" />
                        <Input reference={usernameRef} label="Email" placeholder="johndoe@example.com" className="mt-1 mb-1" />
                        <Input reference={passwordRef} label="Password" placeholder="" type="password" className="mt-1 mb-5" />
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center my-2"><Spinner /></div>
                    ) : (
                        <Button size="md" text="Sign Up" variant="primary" width="auto" onClick={signup} />
                    )}                    <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
                </div>
            </div>
        </div>
    );

}
