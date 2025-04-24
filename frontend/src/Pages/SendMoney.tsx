import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { Input } from "../components/Input";
import { Text } from "../components/Text";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useState } from "react";
import toast from "react-hot-toast";

export const SendMoney = () => {
    const [searchParams] = useSearchParams()
    const id = searchParams.get("id");
    const name = searchParams.get("name")
    const [amount, setAmount] = useState(0)
    const navigate = useNavigate()
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-400">
            <div className="bg-white w-[360px] rounded-lg shadow">
                <Heading label="Send Money" className="text-center mt-5 mb-7" align="center" style="bold" />

                <div className="flex flex-col items-center p-4 gap-4">
                    <div className="rounded-full h-14 w-14 bg-slate-200 flex justify-center items-center text-xl font-semibold">
                        {name ? name[0].toUpperCase() : "?"}
                    </div>

                    <Text text={name || ""} size="md" color="black" style="bold" />

                    <Input onChange={(e) => {
                        setAmount(Number(e.target.value))
                    }} placeholder="Enter amount" label="Amount in $" />

                    <Button onClick={() => {
                        axios.post(`${BACKEND_URL}/api/v1/account/transfer`, {
                            transferTo: id,
                            amount
                        }, {
                            headers: {
                                Authorization: "Bearer " + localStorage.getItem("token")
                            }
                        }).then(() => {
                            toast.success("Transfer succesfull!")
                            navigate("/dashboard")
                        }).catch((e) => {
                            toast.error(e?.response?.data?.message || "Something went wrong");
                        })
                    }}
                        variant="secondary"
                        text="Initiate Transfer"
                        size="md"
                    />
                </div>
            </div>
        </div>
    );
};
