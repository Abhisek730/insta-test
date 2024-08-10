import React,{useState} from "react";
import TopNav from "../components/headers/TopNav/TopNav";
import MobileNav from "../components/headers/MobileNav/MobileNav";
import LargeNav from "../components/headers/LargeNav/LargeNav";
import LogOut from "../components/LogOut/LogOut";
import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom";


const AppLayout = () => {
    const {logout} = useAuth()
    const [isLogOutModalOpen,setIsLogOutModalOpen] = useState(false)
    const openLogOutModal = ()=>setIsLogOutModalOpen(true)
    const closeLogOutModal = ()=>setIsLogOutModalOpen(false);

    const handleLogOut = ()=>{
        logout()
        closeLogOutModal()
    }

    return (
        <div className="home w-full min-h-screen">
            <div className="w-full h-auto flex items-start justify-between  md:gap-x-16 sm:gap-x-8 gap-x-4 relative">
                {/* sidebar  */}
                <div className="lg:w-[18%] sm:w-none md:w-none h-[100vh] pt-10 px-3 border-r border-r-gray-500 sticky top-0 left-0 lg:block sm:hidden md:block hidden">
                    <LargeNav openLogOutModal = {openLogOutModal}></LargeNav>
                </div>
                <div className="w-full h-auto py-1 px-3 border-t border-t-[#1d1d1d] fixed bottom-0 left-0 lg:hidden md:hidden sm:block z-50 bg-white"><MobileNav></MobileNav></div>
                <div className="w-full h-auto py-1 px-3 border-b border-b-[#1d1d1d] fixed top-0 left-0 lg:hidden md:hidden sm:block z-50 bg-white"><TopNav openLogOutModal={openLogOutModal}></TopNav ></div>
               <Outlet></Outlet>
            </div>
{isLogOutModalOpen && <LogOut onClose={closeLogOutModal}  onConfirm = {handleLogOut}/>}
        </div>
    )
}

export default AppLayout