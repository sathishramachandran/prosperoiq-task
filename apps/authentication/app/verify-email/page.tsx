import VerifiedPage from '@/components/main_ui/Auth/Signup/VerifiedPage'
import React, { Suspense } from 'react'

type Props = {}

const page = (props: Props) => {
  return (
   
     <div className="bg-[#1A1022] grid place-content-center h-screen">
      <Suspense fallback={null}>
        <VerifiedPage/>
      </Suspense>
    </div>
  )
}

export default page