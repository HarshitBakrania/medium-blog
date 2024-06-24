import { SignupSchema } from "@h_bakrania/medium-common";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: {type: "signup" | "signin"}) =>{
    const navigate = useNavigate();
    const [inputs, setInputs] = useState<SignupSchema>({
        name: "",
        email: "",
        password: ""
    });

    async function sendRequest(){
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, inputs);
            const jwt = response.data.jwt;
            console.log(jwt);
            const token = localStorage.setItem("token", jwt);
            console.log(token)
            navigate("/blogs");
        }catch(error){
            alert("Error while signing up")
            console.log(error)
        }
    }

    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="font-bold text-5xl">
                    Create an account 
                </div>
                <div className="flex justify-center text-xl text-slate-600 pt-2">
                    {type === "signup"? "Already have an account?" : "Dont have an account?"}
                    <Link className="pl-2 underline" to = {type === "signup" ? "/signin" : "/signup"}>
                        {type === "signup" ? "Login" : "Sign Up"}
                    </Link>
                </div>
                {type === "signup" ? <LabelledInputBox label="Name" placeholder="Enter your name" onChange={(e) =>{
                    setInputs({
                        ...inputs,
                        name: e.target.value
                    })
                }} /> : null}
                <LabelledInputBox label="Email" placeholder="Enter your email address" onChange={(e) =>{
                    setInputs({
                        ...inputs,
                        email: e.target.value
                    })
                }} />
                <LabelledInputBox label="Password" type={"password"} placeholder="Enter your password" onChange={(e) =>{
                    setInputs({
                        ...inputs,
                        password: e.target.value
                    })
                }} />
                <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign Up" : "Sign in"}</button>
            </div>
        </div>
    </div>
}

interface LabelledInputType {
    label: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string
}

function LabelledInputBox({ label, placeholder, onChange, type}: LabelledInputType){
    return <div>
        <label className="block mb-2 text-base font-semibold text-black pt-5">{label}</label>
        <input onChange={onChange} type={ type || "text"} id="first_name" className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}