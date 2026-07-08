
'use client'

import { useRouter } from "next/navigation";


const MainPage = () => {
    const router = useRouter()
    return (
        <div className="flex justify-center items-center h-screen">
            <button onClick={() => router.push('https://auth.prosperoiq.com/customsiqlogin')} className="bg-[#7D0DA7] text-white font-medium text-lg px-13 rounded-sm py-2 cursor-pointer">
                Login
            </button>
        </div>
    );
}

export default MainPage
