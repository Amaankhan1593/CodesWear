// 'use client'
// import React, { useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation';
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function page() {
//   const router = useRouter()
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
  
//       const handleChange = (e) => {
//        if (e.target.name === 'email') {
//           setEmail(e.target.value)
//         } else if (e.target.name === 'password') {
//           setPassword(e.target.value) // ✅ Fix here
//         }
//       }
  
//       const handleSubmit = async (e) => {
//         e.preventDefault()
//         const data = {email, password }
//         let res = await fetch("http://localhost:3000/api/login", {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(data),
//         })
//         let response = await res.json()
//         console.log(response)
//         setEmail('')
//         setPassword('')
//         if(response.success){
//           toast('Your are successfully logged in', {
//           position: "top-center",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "light",
//           transition: Bounce,
//           });
//           router.push('http://localhost:3000')
//         }
//         else{
//           toast.error('Invalid Credentials', {
//           position: "top-center",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "light",
//           transition: Bounce,
//           });
//         }
//       }
  
//   return (
//     <div>
//       <ToastContainer
//               position="top-center"
//               autoClose={3000}
//               hideProgressBar={false}
//               newestOnTop={false}
//               closeOnClick={false}
//               rtl={false}
//               pauseOnFocusLoss
//               draggable
//               pauseOnHover
//               theme="light"
//               transition={Bounce}
//               />
//       <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//           <img
//             className="mx-auto h-15 w-auto"
//             src="/codeswearcircle.png"
//             alt="Your Company"
//           />
//           <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
//             Sign in to your account
//           </h2>
//           <Link href={'/signup'}><p className="text-center font-bold text-xl">Or SignUp</p></Link>
//         </div>

//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//           <form onSubmit={handleSubmit} className="space-y-6" method="POST">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm/6 font-medium text-gray-900"
//               >
//                 Email address
//               </label>
//               <div className="mt-2">
//                 <input onChange={handleChange}
//                   type="email"
//                   name="email"
//                   id="email"
//                   autoComplete="email"
//                   required
//                   value={email}
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6"
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center justify-between">
//                 <label
//                   htmlFor="password"
//                   className="block text-sm/6 font-medium text-gray-900"
//                 >
//                   Password
//                 </label>
//                 <div className="text-sm">
//                   <Link
//                     href="/forgot"
//                     className="font-semibold text-pink-600 hover:text-pink-500"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//               </div>
//               <div className="mt-2">
//                 <input onChange={handleChange}
//                   type="password"
//                   name="password"
//                   id="password"
//                   autoComplete="current-password"
//                   required
//                   value={password}
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-600 sm:text-sm/6"
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
//               >
//                 Sign in
//               </button>
//             </div>
//           </form>

//           {/* <p className="mt-10 text-center text-sm/6 text-gray-500">
//             Not a member?
//             <a
//               href="#"
//               className="font-semibold text-pink-600 hover:text-pink-500"
//             >
//               Start a 14 day free trial
//             </a>
//           </p> */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default page;
'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(()=>{
    if (localStorage.getItem('token')) {
      router.push('/')
    }
  }, [])

  const handleChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };

    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const response = await res.json();
      console.log('Login Response:', response);

      if (response.success) {
        localStorage.setItem('token', response.token); // ✅ Store token
        toast.success('You are successfully logged in!', {
          position: "top-center",
          autoClose: 1000,
          transition: Bounce,
        });

        setEmail('');
        setPassword('');

        // Optional: delay routing after toast
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        toast.error(response.error || 'Invalid credentials', {
          position: "top-center",
          autoClose: 2000,
          transition: Bounce,
        });
      }
    } catch (err) {
      console.error('Login failed:', err);
      toast.error('Something went wrong. Try again!', {
        position: "top-center",
        autoClose: 1000,
        transition: Bounce,
      });
    }
  }

  return (
    <div>
      <ToastContainer />
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-15 w-auto" src="/codeswearcircle.png" alt="Logo" />
          <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <Link href="/signup">
            <p className="text-center font-bold text-xl text-pink-600">Or SignUp</p>
          </Link>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
              <input
                onChange={handleChange}
                value={email}
                type="email"
                name="email"
                id="email"
                required
                className="mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-pink-600"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
              <input
                onChange={handleChange}
                value={password}
                type="password"
                name="password"
                id="password"
                required
                className="mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-pink-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-pink-600 py-2 px-4 text-white font-semibold hover:bg-pink-500"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
