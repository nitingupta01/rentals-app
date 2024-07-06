import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CreateListing from './pages/CreateListing';
import ListingDetail from './pages/ListingDetail';
import TripList from './pages/TripList';
import Wishlist from './pages/Wishlist';
import PropertyList from './pages/PropertyList';
import ReservationList from './pages/ReservationList';
import SearchPage from './pages/SearchPage';
import { useDispatch } from 'react-redux';
import { setLogin, setLogout } from './redux/state';
import { useEffect } from 'react';
import { Url } from './utils/constant';

function App() {
  const dispatch=useDispatch();
  const getProfile = async()=>{
    try{
      const response = await fetch(`${Url}/auth/profile`,{
        method:'GET',
        credentials:'include'
      });

      const result=await response.json();
      if(response.status===200){
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
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/create-listing' element={<CreateListing/>}/>
          <Route path='/properties/:listingId' element={<ListingDetail/>}/>
          <Route path='/user/trips' element={<TripList/>} />
          <Route path='/user/wishlist' element={<Wishlist/>} />
          <Route path='/user/properties' element={<PropertyList/>} />
          <Route path='/user/reservations' element={<ReservationList/>} />
          <Route path='/properties/search/:search' element={<SearchPage/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </div>
  );
}

export default App;
