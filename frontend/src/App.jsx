import React, { useEffect } from 'react';
import Home from './pages/home';
import Navbar from './components/Navabar/Navbar';
import Footer from './components/Footer/Footer';
import {  Route, Routes } from 'react-router-dom';
import AllBooks from './pages/AllBooks';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './store/auth'; // Make sure to import your authActions

import Favourites from './components/Profile/Favourites';
import UserOrderHistory from './components/Profile/UserOrderHistory';
import Setting from './components/Profile/Setting';
import AllOrdersPage from './pages/AllOrdersPage'; // create this file/component
import AddBookPage from './pages/AddBookPage';     // create this file/component

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state)=>state.auth.role);
  useEffect(()=>{
    if (localStorage.getItem("id")) dispatch(authActions.login());
    if (localStorage.getItem("role")) dispatch(authActions.changeRole(localStorage.getItem("role")));
    if (localStorage.getItem("token")) dispatch(authActions.login());
  }, [dispatch]);
  
  return (
    <div>
   
       <Navbar/>
       <Routes>
        <Route exact path='/' element={<Home/>}/>
                <Route  path='/all-books' element={<AllBooks/>}/>
                <Route path = '/cart' element = {<Cart/>}/>
                <Route path='/profile' element={<Profile/>}>
                {  role === "user" ? 
                  <Route index element={<Favourites/>} /> :
                  <Route index element={<AllOrdersPage/>} />
                }
                 
                 <Route path="/profile/orderHistory" element={<UserOrderHistory/>} />
                 <Route path="/profile/settings" element={<Setting/>} />
                 <Route path="all-order" element={<AllOrdersPage />} />
                 <Route path="add-book" element={<AddBookPage />} />


                </Route>


        <Route  path='/Login' element={<Login/>}/>
                <Route  path='/Signup' element={<SignUp/>}/>
                <Route path='/view-book-details/:id' element={<ViewBookDetails/>}/>


       </Routes>
         <Footer/>
        
       
      
     
      
     
     
    </div>
  );
}

export default App;
