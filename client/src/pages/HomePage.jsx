import React from 'react';
import Navbar from '../components/Navbar';
import Slide from '../components/Slide';
import Categories from '../components/Categories';
import Listing from '../components/Listing';
import Footer from '../components/Footer';
import { useDispatch } from 'react-redux';
import { setLogin, setLogout } from '../redux/state';
import { useEffect } from 'react';
import { Url } from '../utils/constant';

const HomePage = () => {

  const dispatch=useDispatch();
  const getProfile = async()=>{
    try{
      const response = await fetch(`${Url}/auth/profile`,{
        method:'GET',
        credentials:'include'
      });

      const result=await response.json();
      if(response.status===200){
        // console.log
        dispatch(setLogin({user:result}));
      }
      else{
        dispatch(setLogout());
      }
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    getProfile();
  },[])


  return (
    <>
      <Navbar/>
      <Slide/>
      <Categories/>
      <Listing/>
      <Footer/>
    </>
  )
}

export default HomePage