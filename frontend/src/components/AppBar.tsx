import { useEffect, useState } from "react";
import { Text } from "./Text"
import { BACKEND_URL } from "../config";
import axios from "axios";

export const AppBar = () => {
    const [firstName, setFirstName] = useState("");


    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/user/me`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {//@ts-ignore
            setFirstName(res.data?.firstName);
        }).catch(err => {
            console.error("Failed to fetch user info", err);
        });
    }, []);

    return (
        <div className="shadow h-14 flex justify-between items-center px-4">
            <Text text="PayBuddy" size="lg" style="bold" color="black" />
            <div className="flex items-center">
                <Text text="Hello" size="lg" style="bold" color="black" className="mr-2 " />
                <div className="rounded-full h-12 w-12 bg-slate-200 flex items-center justify-center text-xl">
                    {firstName ? firstName[0].toUpperCase() : "?"}
                </div>
            </div>
        </div>
    )

}

