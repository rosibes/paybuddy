import { use, useEffect, useState } from "react";
import { AppBar } from "../components/AppBar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/Button";

export const Dashboard = () => {
    const [balance, setBalance] = useState<string>("0");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(`${BACKEND_URL}/api/v1/account/balance`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                //@ts-ignore
                setBalance(response.data?.balance.toFixed(2));
            } catch (err) {
                console.error("Error fetching balance", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Spinner />
            </div>
        );
    }
    return (
        <div>
            <AppBar />
            <Balance value={balance} />
            <Users />
        </div>
    )
}