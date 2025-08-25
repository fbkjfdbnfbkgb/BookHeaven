import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHeart, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';


const Sidebar = ({ data }) => {
  const location = useLocation();
    const history = useNavigate();
    const dispatch = useDispatch();



  const links = [
    {
      to: "/profile",
      label: "Favourites",
      icon: <FaHeart />
    },
    {
      to: "/profile/orderHistory",
      label: "Order History",
      icon: <FaHistory />
    },
    {
      to: "/profile/settings",
      label: "Settings",
      icon: <FaCog />
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className='hidden lg:flex h-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800 p-4 rounded-2xl shadow-2xl text-white flex-col items-center justify-between gap-4 border border-zinc-700 overflow-y-auto'>
        {/* Top: Profile Image, Username and Email */}
        <div className='flex flex-col items-center justify-center gap-2 w-full'>
          <img
            className="h-[10vh] w-[10vh] object-cover rounded-lg border-2 border-white/30 shadow-lg transition-transform duration-300 hover:scale-105"
            src={data.avatar}
            alt=""
          />
          <p className='text-xl text-zinc-100 font-bold tracking-wide'>
            {data.username}
          </p>
          <p className='text-sm text-zinc-300 font-medium'>
            {data.email}
          </p>
        </div>

        {/* Middle: Links */}
       {data.role === "user" && (
         <div className='w-full flex flex-col items-center justify-center gap-2 mt-2 mb-2'>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 text-center w-[95%] px-4 py-2 rounded-xl shadow-lg border border-zinc-300
                backdrop-blur-md bg-white/20
                transition-all duration-300
                ${location.pathname === link.to
                  ? 'bg-white/40 border-white font-bold scale-105 text-zinc-900'
                  : 'hover:bg-white/30 hover:border-zinc-400 hover:scale-105 hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.5)] hover:brightness-110 text-white'
                }`}
              style={{
                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
              }}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="flex-1 font-semibold min-w-0 truncate">{link.label}</span>
            </Link>
          ))}
        </div>
        )}
        {data.role === "admin" && (
          <div className='w-full flex flex-col items-center justify-center gap-2 mt-2 mb-2'>
            <Link
              to="/profile/all-order"
              className="flex items-center gap-3 w-[95%] px-4 py-2 rounded-xl shadow-lg border border-blue-400 bg-blue-600/30 text-white font-semibold hover:bg-blue-600/50 hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.3)] transition-all duration-300"
            >
              <span className="text-xl"><FaHistory /></span>
              <span className="flex-1 min-w-0 truncate">All Orders</span>
            </Link>
            <Link
              to="/profile/add-book"
              className="flex items-center gap-3 w-[95%] px-4 py-2 rounded-xl shadow-lg border border-green-400 bg-green-600/30 text-white font-semibold hover:bg-green-600/50 hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.3)] transition-all duration-300"
            >
              <span className="text-xl"><FaCog /></span>
              <span className="flex-1 min-w-0 truncate">Add Book</span>
            </Link>
          </div>
        )}

        {/* Bottom: Logout Button */}
        <button
          className="flex items-center gap-3 w-[95%] px-4 py-2 rounded-xl shadow-lg border border-red-400 bg-red-600/30 text-white font-semibold hover:bg-red-600/50 hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.3)] transition-all duration-300 mb-2"
          onClick={() => {
            dispatch(authActions.logout());
            dispatch(authActions.changeRole('user'));
            localStorage.clear("id");
            localStorage.clear("token");
            localStorage.clear("role");
            history("/");
          }}
        >
          <FaSignOutAlt className="text-xl" />
          <span className="flex-1 min-w-0 truncate">Logout</span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Profile Header */}
        <div className="bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-800 p-3 rounded-xl shadow-md text-white mb-3 border border-zinc-700">
          <div className="flex items-center gap-3">
            <img
              className="h-12 w-12 object-cover rounded-full border border-white/30 shadow"
              src={data.avatar}
              alt=""
            />
            <div className="flex-1">
              <p className="text-base font-bold">{data.username}</p>
              <p className="text-xs text-zinc-300 truncate">{data.email}</p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Grid (compact buttons) */}
    {data.role === "user" && (
      <div className='w-full flex flex-col items-center justify-center gap-2 mt-2 mb-2'>
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 text-center w-[95%] px-4 py-2 rounded-xl shadow-lg border border-zinc-300
              backdrop-blur-md bg-white/20
              transition-all duration-300
              ${location.pathname === link.to
                ? 'bg-white/40 border-white font-bold scale-105 text-zinc-900'
                : 'hover:bg-white/30 hover:border-zinc-400 hover:scale-105 hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.5)] hover:brightness-110 text-white'
              }`}
            style={{
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
            }}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="flex-1 font-semibold min-w-0 truncate">{link.label}</span>
          </Link>
        ))}
      </div>
    )}
        {/* Admin buttons for mobile */}
        {data.role === "admin" && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Link
              to="/profile/all-order"
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-lg border border-blue-400 bg-blue-600/30 text-white text-xs font-medium hover:bg-blue-600/50 hover:scale-105 hover:shadow-md transition-all duration-300"
            >
              <span className="text-lg"><FaHistory /></span>
              <span className="text-xs text-center leading-tight">All Orders</span>
            </Link>
            <Link
              to="/profile/add-book"
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-lg border border-green-400 bg-green-600/30 text-white text-xs font-medium hover:bg-green-600/50 hover:scale-105 hover:shadow-md transition-all duration-300"
            >
              <span className="text-lg"><FaCog /></span>
              <span className="text-xs text-center leading-tight">Add Book</span>
            </Link>
          </div>
        )}

        {/* Mobile Logout Button (compact) */}
        <button
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg shadow-md border border-red-400 bg-red-600/30 text-white text-sm font-semibold hover:bg-red-600/50 hover:shadow-md transition-all duration-300"
          onClick={() => {
            dispatch(authActions.logout());
            dispatch(authActions.changeRole('user'));
            localStorage.clear("id");
            localStorage.clear("token");
            localStorage.clear("role");
            history("/");
          }}
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}


export default Sidebar;
