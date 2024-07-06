import '../styles/List.scss';
import Navbar from '../components/Navbar';
import { useSelector,useDispatch } from 'react-redux';
import ListingCard from '../components/ListingCard';
import { Url } from '../utils/constant';
import { useEffect,useState } from 'react';
import { setPropertyList } from '../redux/state';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import {toast} from 'react-toastify';

const PropertyList = () => {
    const [loading,setLoading]=useState(true);
    const dispatch = useDispatch();
    const properties=useSelector((state)=>state.user?.propertyList);

    const getProperties = async()=>{
        setLoading(true);
        try{
            const response = await fetch(`${Url}/users/properties`,{
                method:'GET',
                credentials:'include'
            })
            const data= await response.json();
            dispatch(setPropertyList(data));
            setLoading(false);
        }catch(err){
            toast.error('Server Error');
            console.log(err);
        }
    }

    useEffect(()=>{
        getProperties();
    },[]);

    return (
        <>
            <Navbar/>
            <h2 className='title-list'>Your Properties List</h2>
            {loading?<Loader/>:
            <div className='list'>
                {properties?.length===0 && <h3>No Results Found</h3>}
                {properties?.map(({_id,listingPhotos,city,province,country,category,type,price})=>(
                    <ListingCard _id={_id} listingPhotos={listingPhotos} 
                    city={city}
                    province={province}
                    category={category}
                    type={type}
                    price={price}
                    country={country}
                    />
                ))}
            </div>
            }
            <Footer/>
        </>
    )
}

export default PropertyList;