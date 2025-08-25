import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Profile/Sidebar';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
const Profile = () => {
    // const isLoggedIn = useSelector()
    const [Profile, setProfile] = useState();
useEffect(() => {
    const fetch = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/get-user-info', {
                headers: {
                    'id': localStorage.getItem("id"),
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };
    fetch();
}, []);
    return (
        <div className=' bg-zinc-900  px-2 md:px-12 flex flex-col md:flex-row h-screen py-8 gap-4 text-white'>
       {!Profile &&<div className='w-full h-[100%] flex items-center justify-center'>
        
        
        
        <Loader/>
        </div>}
       {Profile &&   <>
           <div className='w-full md:w-1/6 '>
                <Sidebar data={Profile}/>
            </div>
            <div className='w-fulll md:w-5/6 h-full overflow-y-auto'>
            
                <Outlet/>
            </div>
         
         </> }
        </div>
    );
}

export default Profile;
