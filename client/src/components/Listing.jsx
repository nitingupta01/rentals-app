import React, { useEffect, useState } from 'react';
import {categories} from '../data/data';
import '../styles/Listings.scss';
import ListingCard from './ListingCard';
import Loader from './Loader';
import { useDispatch, useSelector } from 'react-redux';
import {Url} from '../utils/constant';
import { setListings } from '../redux/state';

const Listing = () => {
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(true);

    const [selectedCategory,setSelectedCategory] = useState('All');
    const listings = useSelector((state)=>state.listings);

    const getFeedListings = async()=>{
        try{
            const response = await fetch(`${Url}/properties/get?category=${selectedCategory}`,{
                method:'GET',
            });
            const data= await response.json();
            // console.log(data);
            dispatch(setListings({listings:data}));
            setLoading(false);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getFeedListings();
    },[selectedCategory]);
    return (
        <>
        <div className='category-list'>
            {categories?.map((item,index)=>(
                <div className={`category ${item.label===selectedCategory?"selected":""}`} key={index} onClick={()=>{setSelectedCategory(item.label)}}>
                    <div className='category_icon'>{item.icon}</div>
                    <p>{item.label}</p>
                </div>
            ))}
        </div>
            {loading?<Loader/>:
                <div className='listings'>
                    {listings?.length==0 && <h3 style={{color:'red'}}>No Results Found for This Category</h3>}
                    {listings?.map(({_id,listingPhotos,city,province,country,category,type,price})=>(
                        <ListingCard key={_id} _id={_id} listingPhotos={listingPhotos} city={city} province={province} country={country} category={category} type={type} price={price} triped={false} />
                    ))}
                </div>
            
        }
        </>
  );
};

export default Listing;