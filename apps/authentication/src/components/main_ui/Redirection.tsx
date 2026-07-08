'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

type Props = {}

const Redirect = (props: Props) => {

  const router = useRouter();

  useEffect(() => {
    router.push('/customsiqlogin');
  }, [])

  return (
    <div>

    </div>
  )
}

export default Redirect