import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import {v4 as uuid} from 'uuid'
import Avtar from "../shared/avtar"
import Card from "../shared/card"
import { useContext, useEffect, useState } from "react"
import Dashboard from "./Dashboard"
import Context from "../Context"
import HttpInterceptor from "../../lib/HttpInterceptor"
import useSWR, { mutate } from "swr"
import Featcher from "../../lib/Featcher"
import { toast } from "react-toastify"
import CatchError from "../../lib/CatchError"
import SuggestionFriend from "./friend/SuggestionFriend"
import FriendRequest from "./friend/FriendRequest"
const EightMintInMs = 8*60*1000

const Layout = ()=>{
    const [leftAsideSize, setLeftAsideSize] = useState(350)
    const rightAsideSize = 450
    const collapseSize = 160
    const navigate = useNavigate()
    const { error } = useSWR('/auth/refresh-token', Featcher, {
        refreshInterval: EightMintInMs,
        shouldRetryOnError: false
    })

    const menus = [
        {
            href:'/app/dashboard',
            label:'dashboard',
            icon:'ri-home-9-line'
        },
        {
            href:'/app/my-posts',
            label:'my post',
            icon:'ri-chat-smile-2-line'
        },
        {
            href:'/app/friends',
            label:'friends',
            icon:'ri-group-line'
        }
    ]

    const {pathname} = useLocation()

    const getPathname = (path: string)=>{
        const firstPath = path.split("/").pop()
        const finalPath = firstPath?.split("-").join(" ")
        return finalPath
    }

    const FriendUiBlockList = [
        '/app/friends',
        '/app/chat',
        '/app/Audio-chat',
        '/app/video-chat'
    ]

    const isBlockedUi = FriendUiBlockList.some((path)=> path === pathname)


    const {session, setSession} = useContext(Context)

    const uploadProfile = ()=>{
        const input = document.createElement("input")
        input.type = 'file'
        input.accept = 'image/*'
        input.click()
        input.onchange = async ()=>{
            if(!input.files)
                return

            const file = input.files[0]

            const ext = file.type.split("/").pop()

            const path = `profile/${uuid()}.${ext}`

            const payload = {
                path,
                type: file.type,
                status: 'public-read'
            }
            
            try{
                const options = {
                    headers: {
                        'Content-Type': file.type
                    }
                }
                const {data} = await HttpInterceptor.post('/storage/upload', payload)
                await HttpInterceptor.put(data.url, file, options)
                const {data: url} = await HttpInterceptor.put('/auth/update-profile', {path})
                setSession({...session, image: url.image})
                mutate('/auth/refresh-token')
                toast.success("Profile Picture Updated...")
            }

            catch(err)
            {
                console.log(err)
            }
        }
    }

    // const download = async ()=>{
    //     try{
    //         const payload = {
    //             path: 'profile/demo.png'
    //         }

    //         const { data } = await HttpInterceptor.post("/storage/download", payload)
    //         const a = document.createElement("a")
    //         a.href = data.url
    //         a.download = 'demo.png'
    //         a.click()
    //     }

    //     catch(err)
    //     {
    //         console.log(err)
    //     }
    // }

    const Logout = async ()=>{
        try{
            await HttpInterceptor.post("/auth/logout")
            navigate("/login")
        }

        catch(err)
        {
            CatchError(err)
        }
    }

    useEffect(()=>{
        if(error){
            Logout()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    return (
        <div className="min-h-screen">
            <aside style={{
                    width:leftAsideSize,
                    transition:'0.2s'
                }} 
                className="h-screen bg-white p-8 fixed top-0 left-0">
                <div className="overflow-hidden space-y-10 h-full rounded-2xl bg-linear-to-br from-indigo-900 via-purple-800 to-blue-900 py-14 px-10">
                    {
                        leftAsideSize === 350 ? 
                        <div className="animate__animated animate__fadeIn">
                            {
                                session &&
                                <Avtar 
                                    image={session.image || './images/avtar.png'}
                                    title={session.fullname}
                                    subtitle={session.email}
                                    titleColor="white"
                                    subtitleColor="#ddd"
                                    onClick={uploadProfile}
                                />
                            }
                        </div>
                        
                        :
                        <div className="animate__animated animate__fadeIn cursor-pointer ml-0.5">
                            <i className="ri-user-3-line text-lg text-white  hover:text-gray-200"></i>
                        </div>
                        
                    }
                    


                <div className="space-y-5">
                    {
                        menus.map((items, index)=>(
                            <Link key={index} to={items.href} className="flex items-center gap-3 capitalize text-white cursor-pointer hover:text-gray-200">
                                <i className={`${items.icon} text-xl`}></i>
                                <p className={`${leftAsideSize === collapseSize ? 'hidden' : ''}`}>{items.label}</p>
                            </Link>
                        ))
                    }
                    

                     <button onClick={Logout} className="flex items-center gap-3 text-white cursor-pointer hover:text-gray-200">
                        <i className="ri-logout-circle-r-line text-xl"></i>
                        <p className={`${leftAsideSize === collapseSize ? 'hidden' : ''}`}>Logout</p>
                    </button>
                </div>

                </div>
            </aside>

            <section style={{
                width:`calc(100% - ${leftAsideSize+rightAsideSize}px)`,
                marginLeft:`${leftAsideSize}px`,
                transition:'0.2s'
            }} 
            className="h-screen py-8 px-2 space-y-8">
                {
                    !isBlockedUi &&
                        <FriendRequest />
                        
                }

                <Card 
                    title={
                        <div className="flex items-center gap-3">
                            <button onClick={()=>setLeftAsideSize(leftAsideSize === 350 ? collapseSize : 350)} className="bg-gray-100 w-10 h-10 rounded-full cursor-pointer hover:bg-gray-200">
                                <i className="ri-arrow-left-line"></i>
                            </button>
                            <h1>{getPathname(pathname)}</h1>
                        </div>
                    }
                    divider
                >
                    <>
                        {
                            pathname === "/app" ? 
                            <Dashboard />
                            :
                            <Outlet/>
                        }
                    </>
                </Card>
                
                {
                    !isBlockedUi &&
                        <SuggestionFriend />
                }
            </section>

            <aside style={{width:rightAsideSize}} className="space-y-5 overflow-auto h-screen bg-white p-8 fixed top-0 right-0 border-l border-gray-100">
                
                <Card title="Friends" divider>
                    <div className="space-y-5">
                        {
                            Array(20).fill("friends").map((index)=>(
                                <div key={index} className="bg-gray-50 rounded p-3 flex justify-between">
                                    <Avtar 
                                        image="/images/avtar.png"
                                        size="md"
                                        title="Kundan Kumar Sah"
                                        subtitle=
                                        {
                                            <label className={`flex gap-1 items-center text-green-400 font-medium`}>Online</label>
                                        }
                                    />

                                    <div className="flex items-center gap-3">
                                        <Link to="chat">
                                            <button title="Chat">
                                                <i className="ri-message-3-line text-lg cursor-pointer"></i>
                                            </button>
                                        </Link>

                                        <Link to='Audio-chat'>
                                            <button title="Audio Call">
                                                <i className="ri-phone-line text-lg cursor-pointer"></i>
                                            </button>
                                        </Link>

                                        <Link to='video-chat'>
                                            <button title="Video Call">
                                                <i className="ri-vidicon-line text-lg cursor-pointer"></i>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </Card>

            </aside>
        </div>
    )
}

export default Layout
