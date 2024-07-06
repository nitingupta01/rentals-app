import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import '../styles/List.scss';
import { Url } from '../utils/constant';
import { setTripList } from '../redux/state';
import { useDispatch, useSelector } from 'react-redux';
import ListingCard from '../components/ListingCard';
import Footer from '../components/Footer';
import {toast} from 'react-toastify';
const TripList = () => {
    const [loading,setLoading]=useState(true);
    const dispatch = useDispatch();
    const tripList = useSelector((state)=>state.user.tripList);

    const getTripList = async()=>{
        setLoading(true);
        try{
            const response=await fetch(`${Url}/users/trips`,{
                method:'GET',
                credentials:'include'
            });

            const result = await response.json();
            dispatch(setTripList(result));
            setLoading(false);
        }catch(err){
            console.log(err);
            toast.error('Server Error')
        }
    }

    useEffect(()=>{
        getTripList();
    },[]);

    return (
        <>
        <Navbar/>
        <h2 className='title-list'>Your Trip List</h2>
        {loading?<Loader/>:(
            <div className='list'>
                {tripList?.length===0 && <h3>No Results Found</h3>}
                {tripList?.map(({listingId,startDate,endDate,totalPrice})=>
                    (<ListingCard _id={listingId._id} listingPhotos={listingId.listingPhotos} city={listingId.city} province={listingId.province}
                        country={listingId.country} category={listingId.category} startDate={startDate} endDate={endDate} price={totalPrice} triped={true}/>)
                )}
            </div>
        )}
        <Footer/>
        </>
    )
}

export default TripList