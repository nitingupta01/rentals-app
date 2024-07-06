import React, { useState } from 'react';
import {IconButton} from '@mui/material';
import {Search , Person , Menu} from '@mui/icons-material';
import {useSelector,useDispatch} from 'react-redux';
import variables from '../styles/variables.scss';
import '../styles/Navbar.scss';
import { setLogout } from '../redux/state';
import { Link, useNavigate } from 'react-router-dom';
import { Url } from '../utils/constant';


const Navbar = () => {
  const [dropdown,setDropdown]=useState(false);
  const [search,setSearch] = useState('');
  const user = useSelector((state)=>state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async()=>{
    try{
      const response = await fetch(`${Url}/auth/logout`,{
        method:'POST',
        credentials:'include'
      });
      const result= await response.json();
      dispatch(setLogout());
      navigate('/');
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className='navbar'>
      <a><Link to='/'>
        <img src='/assets/logo.png' alt=''/>
      </Link></a>
      <div className='navbar_search'>
      <input type='text' placeholder='Search...' value={search} onChange={(e)=>setSearch(e.target.value)}/>
      <IconButton>
        <Search sx={{color:variables.pinkred}}
        onClick={()=>{navigate(`/properties/search/${search}`)}}
        />
      </IconButton>
      </div>
      <div className='navbar_right'>
        {user? (<a className='host'><Link to="/create-listing" style={{textDecoration:'none'}}>Become A Host</Link></a>):(
          <a className='host'><Link to='/login' style={{textDecoration:'none'}}>Become a Host</Link></a>
        )}
        <button onClick={(e)=>{setDropdown(!dropdown)}} className='navbar_right_account'>
          <Menu sx={{color:variables.darkgrey}}/>
          {!user?(<Person sx={{color:variables.darkgrey}}/>):
          (<img src={user.profileImageURL} alt="Profile Image" style={{objectFit:'cover',borderRadius:'50%'}}/>)
          }
        </button>
        {dropdown && !user && (
          <div className='navbar_right_accountmenu'>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>)}
        
        {dropdown && user && (
        <div className='navbar_right_accountmenu'>
          <Link to="/user/trips">Trip List</Link>
          <Link to="/user/wishlist">Wish List</Link>
          <Link to="/user/properties">Property List</Link>
          <Link to="/user/reservations">Reservation List</Link>
          <Link to="/create-listing">Become A Host</Link>
          <Link to="/login" onClick={handleLogout}>Log Out</Link>
        </div>)}
      </div>
    </div>
  )
}

export default Navbar