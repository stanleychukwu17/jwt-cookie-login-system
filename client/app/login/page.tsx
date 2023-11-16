"use client"
import axios from 'axios';
import {useCallback, useLayoutEffect, useState} from "react";
import {useForm, SubmitHandler} from "react-hook-form"
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { updateUser } from '../redux/features/userSlice';

import MessageComp, {MessageCompProps} from "../components/Message/MessageComp";

import './page.scss'



// gets the backEnd url from our .env file
const backEndPort = "http://localhost:4000";

type LoginForRHF = {
    username: string
    password: string
}

export default function LoginPage() {
    const dispatch = useAppDispatch()
    const route = useRouter()
    const [isLoading1, setIsLoading1] = useState<boolean>(false) // used for login
    const [isLoading2, setIsLoading2] = useState<boolean>(false) // used for registering
    const [showAlert, setShowAlert] = useState<boolean>(false) // for showing of error messages from the backend
    const [alertMsg, setAlertMsg] = useState<MessageCompProps>({msg_type:'', msg_dts:''}) // the error message

    // setting up React Hook Form to handle the forms below(i.e both the login and registration forms)
    const { register: registerLogin, handleSubmit: handleLoginSubmit, setValue: loginSetValue, formState: {errors:loginError} } = useForm<LoginForRHF>()

    // console.log(`${backEndPort}/users/login`)

    const submitLogin: SubmitHandler<LoginForRHF> = (data) => {
        axios.post(`${backEndPort}/users/login`, data, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
            console.log(res.data)
            // if(res.data.msg === 'okay') {
            //     localStorage.setItem('userDts', JSON.stringify(res.data));
            //     dispatch(updateUser({loggedIn: 'yes', ...res.data}))

            //     // waits a little bit so that redux can finish it's thing and they i can redirect to the home page
            //     setTimeout(() => {
            //         route.push('/')
            //     }, 500)

            //     // clears all of the input field for login
            //     Object.keys(data).forEach((item) => {
            //         loginSetValue(item as "username" | "password", "") // RHF hook used here
            //     })
            // } else {
            //     setShowAlert(true)
            //     setAlertMsg({'msg_type':res.data.msg, 'msg_dts':res.data.cause})
            // }
            // setIsLoading1(false)
        })
        .catch((err) => {
            setShowAlert(true)
            setAlertMsg({'msg_type':'bad', 'msg_dts':err.message+', please contact the customer support and report this issue'})
            setIsLoading1(false)
        });
    }

    const getSessionData = useCallback(() => {
        axios.post(`${backEndPort}/users/getSessionData`, {}, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
            console.log(res.data)
        })
    }, [])

    return (
        <div className="block relative my-14 padding-x">
            <div className="hidden">
                {/* <Header /> */}
            </div>
            {/* {showAlert && <MessageComp {...alertMsg} closeAlert={setShowAlert} />} */}

            <div className="pb-10 text-4xl">Hi there!</div>
            <div className="ovrCover flex">
                <div className="w-1/2">
                    <div className="titleUp">Login</div>
                    <form onSubmit={handleLoginSubmit(submitLogin)}>
                        <div className="inputCover">
                            <div className="inpTitle font-bold">Username or Email</div>
                            <div className="inpInput">
                                <input type="text" {...registerLogin("username", { required: true })} />
                                {loginError.username && <p>This field is required!!!</p>}
                            </div>
                        </div>
                        <div className="inputCover">
                            <div className="inpTitle">Password</div>
                            <div className="inpInput">
                                <input type="password" {...registerLogin("password", { required: true })} />
                                {loginError.password && <p>This field is required!!!</p>}
                            </div>
                        </div>
                        <div className="btnCvr">
                            {!isLoading1 && <button type="submit">Login</button>}
                            {isLoading1 && <p>Loading...</p>}
                        </div>
                    </form>
                </div>

                <div className="w-3/12">
                    <div className="titleUp">Login</div>
                    <div className="btnCvr">
                        <button onClick={() => getSessionData()}>Get session data</button>
                    </div>
                    <div className=""></div>
                </div>

                <div className="w-3/12">
                    <div className="titleUp">Logout</div>
                    <div className="btnCvr">
                        <button className="">Logout session</button>
                    </div>
                    <div className=""></div>
                </div>
            </div>
        </div>
    )
}
