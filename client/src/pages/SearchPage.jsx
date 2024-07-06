import '../styles/List.scss';
import Navbar from '../components/Navbar';
import { useSelector , useDispatch} from 'react-redux';
import ListingCard from '../components/ListingCard';
import Loader from '../components/Loader';
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Url } from '../utils/constant';
import { setListings } from '../redux/state';
import Footer from '../components/Footer';
import {toast} from 'react-toastify';

const SearchPage = () => {
    const [loading,setLoading]=useState(true);
    const {search} = useParams();
    const dispatch = useDispatch();
    const listings = useSelector((state)=>state.listings);

    const getSearch  = async()=>{
        setLoading(true);
        try{
            const response= await fetch(`${Url}/properties/search/${search}`,{
                method:'GET'
            })
            const data = await response.json();
            dispatch(setListings({listings:data}));
            setLoading(false);
        }catch(err){
            console.log(err);
            toast.error('Server Error')
        }
    }

    useEffect(()=>{
        getSearch();
    },[search])

  return (
    <>
            <Navbar/>
            <h2 className='title-list'>{search}</h2>
            <>
            {loading?<Loader/>:
            (<div className='list'>
            {listings?.length===0 && <h3 style={{height:'90vh'}}>No Results Found</h3>}
            {listings?.map(({_id,listingPhotos,city,province,country,category,type,price})=>(
                <ListingCard _id={_id} listingPhotos={listingPhotos} 
                city={city}
                province={province}
                category={category}
                type={type}
                price={price}
                country={country}
                />
            ))}
            </div>)
            }
            </>
            <Footer/>
        </>
  )
}

export default SearchPage;