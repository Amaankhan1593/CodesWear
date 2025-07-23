'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';

const page = () => {
    const router = useRouter();

    useEffect(()=>{
        if (!localStorage.getItem('token')) {
            router.push('/')
        }
    },[])


  return (
    <div>
      my account
    </div>
  )
}

export default page
