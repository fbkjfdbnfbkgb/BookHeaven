import React from 'react';
import { useState } from 'react';
import { FaGripLines } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const Navbar = () => {
    const links = [
        {
            title: "Home",
            link : "/"
        },
     {
       title: "All Books",
       link : "/all-books"
     },
     
        {
            title: "Cart",
            link : "/cart"
        },
        {
            title: "Profile",
            link : "/profile"
        },
          {
            title: "Admin Profile",
            link : "/profile"
        },
   
    ];
    const isLoggedIn = useSelector((state)=>state.auth.isLoggedIn);
    const role = useSelector((state)=>state.auth.role);

    if(isLoggedIn === false){
      links.splice(2,2);
    }
  
    if(isLoggedIn === true && role === "user"){
      links.splice(4,1);
    }

    if(isLoggedIn === true && role === "admin"){
      links.splice(2,1);
    }


    const [MobileNav , setMobileNav] =  useState("hidden");
    return (
      <>
      <nav className='relative z-50 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 text-white px-8 py-4 flex justify-between items-center shadow-lg rounded-none'>
       <Link to="/" className='flex items-center gap-3 hover:scale-105 transition-transform duration-300'>
        <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 shadow-md'>
          <img className='h-full w-full object-cover' src="https://plus.unsplash.com/premium_photo-1677187301535-b46cec7b2cc8?q=80&w=1223&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
        </div>
        <h1 className='text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent drop-shadow-lg'>BookHeaven</h1>
       </Link>
       <div className='nav-links-bookheaven block md:flex gap-6 items-center'>
         <div className='hidden md:flex items-center gap-6'>
         {links.map((items,i)=>(
          (items.title === "Profile" || items.title === "Admin Profile") ? (
            <Link to={items.link}
              className="px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer font-medium text-base" key={i}>{items.title}</Link>
          ) : (
            <Link to={items.link}
              className="px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer font-medium text-base" key={i}>{items.title}</Link>
          )
        ))}
         </div>
       
        {isLoggedIn === false && (
        <>
         <Link to="/Login" className="px-4 text-base font-semibold mb-2 py-1 border border-blue-500 text-white hover:text-blue-700 hover:bg-white rounded transition-all duration-400 shadow-lg">Login</Link>
        <Link to="/Signup" className="px-4 text-base font-semibold mb-2 py-1 bg-blue-500 rounded text-white hover:text-blue-700 hover:bg-white transition-all duration-400 shadow-lg border border-blue-500">SignUp</Link>
        </>
         )}
         <button onClick={()=>{
        MobileNav =="hidden" ?  setMobileNav("block") : setMobileNav ("hidden");
         }}className='text-2xl hover:text-blue-400 transition-all duration-300 block md:hidden p-1 rounded bg-zinc-700 shadow-md'>
        <FaGripLines />
         </button>
       </div>
      </nav>
      <div className={`bg-zinc-900/95 h-screen text-xl absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center backdrop-blur-md ${MobileNav}`}>
         {links.map((items,i)=>(
          <Link to={items.link}
            className="hover:text-blue-400 mb-6 text-white font-bold text-3xl transition-all duration-300 cursor-pointer px-6 py-2 rounded hover:bg-zinc-700/80 shadow-lg" key={i}
             onClick={()=>{
        MobileNav =="hidden" ?  setMobileNav("block") : setMobileNav ("hidden");
            }}>{items.title}</Link>
        ))}
         {isLoggedIn === false && (
        <>
         <Link to="/Login" className="px-6 text-xl font-semibold mb-4 py-2 border border-blue-500 text-white hover:text-blue-700 hover:bg-white rounded transition-all duration-400 shadow-lg">Login</Link>
        <Link to="/Signup" className="px-6 text-xl font-semibold mb-4 py-2 bg-blue-500 rounded text-white hover:text-blue-700 hover:bg-white transition-all duration-400 shadow-lg border border-blue-500">SignUp</Link>
        </>
         )}
      </div>
      </>
    );
}

export default Navbar;

