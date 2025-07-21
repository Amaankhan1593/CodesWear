'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

    const handleChange = (e) => {
      if (e.target.name === 'name') {
        setName(e.target.value)
      } else if (e.target.name === 'email') {
        setEmail(e.target.value)
      } else if (e.target.name === 'password') {
        setPassword(e.target.value) // ✅ Fix here
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      const data = { name, email, password }
      let res = await fetch("http://localhost:3000/api/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()
      console.log(response)
      setEmail('')
      setName('')
      setPassword('')
      toast('Your account has been created', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
      });
    }

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        />
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-15 w-auto" src="/codeswearcircle.png" alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign up for an account
        </h2>
        <Link href={'/login'}>
          <p className="text-center font-bold text-xl">Or Login</p>
        </Link>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6" method="POST">
          <div>
            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Name</label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                type="text"
                name="name" // ✅ Fix
                id="name"
                required
                value={name}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-pink-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                type="email"
                name="email"
                id="email"
                required
                value={email}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-pink-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                type="password"
                name="password" // ✅ Fix
                id="password"
                required
                value={password}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-pink-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Page
