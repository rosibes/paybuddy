import { use, useEffect, useState } from "react";
import { Input } from "./Input"
import { Text } from "./Text"
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("")

    useEffect(() => {
        const currentUserId = localStorage.getItem("userId");

        axios.get(`${BACKEND_URL}/api/v1/user/bulk`)
            .then(response => {
                //@ts-ignore
                const allUsers = response.data?.user || [];

                const filteredUsers = allUsers.filter((user: any) =>
                    user._id !== currentUserId &&
                    (`${user.firstName} ${user.lastName} ${user.username}`)
                        .toLowerCase()
                        .includes(filter.toLowerCase())
                );

                setUsers(filteredUsers);
            });
    }, [filter]);


    return (
        <div className="p-4">
            <Text text="Users" size="md" style="bold" />
            <Input onChange={(e) => { setFilter(e.target.value) }} placeholder="Search users..." />

            <div>
                {users.map(user => <User user={user} />)}
            </div>


        </div>
    )

    function User({ user }: { user: any }) {
        const navigate = useNavigate();

        return (
            <div className="rounded px-4 py-2 flex justify-between items-center ">
                <div className="flex items-center">
                    <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center items-center mr-3 text-xl font-semibold">
                        {user.firstName[0]}
                    </div>
                    <Text
                        text={`${user.firstName} ${user.lastName}`}
                        size="lg"
                        color="black"
                    />
                </div>
                <Button text="Send Money" variant="primary" size="sm" onClick={() => navigate("/send?id=" + user._id + "&name=" + user.firstName)} />
            </div>
        );
    }
}