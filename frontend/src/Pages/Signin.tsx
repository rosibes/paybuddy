import { useRef, useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { Input } from "../components/Input"
import { BACKEND_URL } from "../config"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast";
import axios from "axios"
import { Spinner } from "../components/Spinner"
import { useAuth } from "../auth/AuthContext"

export const Signin = () => {
    const { setUser } = useAuth();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const signin = async () => {
        try {
            setIsLoading(true);
            const username = usernameRef.current?.value;
            const password = passwordRef.current?.value;

            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
                username,
                password
            })
            //@ts-ignore
            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            //@ts-ignore
            localStorage.setItem("userId", response.data.userId);

            // 👇 Aici iei datele utilizatorului curent
            const meResponse = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });

            setUser(meResponse.data);
            toast.success("Sign in succesfull!");

            navigate('/dashboard')
        } catch (e: any) {
            const message = e?.response?.data?.message || "Sign up failed!";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-slate-400 min-h-screen flex items-center justify-center">
            <div className="w-90 h-auto flex justify-center bg-white rounded-lg shadow">
                <div className="p-6 flex flex-col ">
                    <Heading label="Sign in" className="text-center" align="center" style="bold" />
                    <Heading label="Enter your credentials to acces your account" size="lg" align="center" className="text-center" />
                    <Input reference={usernameRef} label="Email" placeholder="johndoe@example.com" className="mt-1 mb-4" />
                    <Input reference={passwordRef} type="password" label="Password" placeholder="" className="mt-1 mb-5" />
                    {isLoading ? <Spinner /> : (
                        <Button size="md" text="Sign In" variant="primary" width="auto" onClick={signin} />
                    )}                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
                </div>

            </div>
        </div>
    )
}