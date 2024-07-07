import '../styles/List.scss';
import Navbar from '../components/Navbar';
import { useSelector,useDispatch } from 'react-redux';
import ListingCard from '../components/ListingCard';
import { Url } from '../utils/constant';
import { useEffect,useState } from 'react';
import { setReservationList } from '../redux/state';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import {toast} from 'react-toastify';

const ReservationList = () => {
    const [loading,setLoading]=useState(true);
    const dispatch = useDispatch();
    const reservations=useSelector((state)=>state.user?.reservationList);

    const getReservations = async()=>{
        setLoading(true);
        try{
            const response = await fetch(`${Url}/users/reservations`,{
                method:'GET',
                credentials:'include'
            })
            const data= await response.json();
            dispatch(setReservationList(data));
            setLoading(false);
        }catch(err){
            console.log(err);
            toast.error('Server Error');
        }
    }

    useEffect(()=>{
        getReservations();
    },[]);

    return (
        <>
            <Navbar/>
            <h2 className='title-list'>Your Bookings List</h2>
            {loading?<Loader/>:
            <div className='list'>
                {reservations?.length===0 && <h3>No Results Found</h3>}
                {reservations?.map(({startDate,endDate,customerId,listingId})=>(
                    <ListingCard _id={listingId._id} listingPhotos={listingId.listingPhotos} 
                    city={listingId.city}
                    province={listingId.province}
                    category={listingId.category}
                    type={listingId.type}
                    price={listingId.price}
                    country={listingId.country}
                    startDate={startDate}     
                    endDate={endDate}  
                    profileImageURL={customerId.profileImageURL}    
                    bookedBy={`${customerId.firstName} ${customerId.lastName}`}       
                    triped={true}     
                    />
                ))}
            </div>
            }
            <Footer/>
        </>
    )
}

export default ReservationList