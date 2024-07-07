import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ListingDetails.scss';
import { Url } from '../utils/constant';
import Loader from '../components/Loader';
import { useEffect, useState } from 'react';
import { facilities } from '../data/data';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import Navbar from '../components/Navbar';
import {toast} from 'react-toastify';
import { CircularProgress } from '@mui/material';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';

const ListingDetail = () => {
    const user=useSelector((state)=>state.user);
    const params = useParams();
    const navigate=useNavigate();
    const listingId= params.listingId;
    const [listing,setListing]=useState(null);
    const [loading , setLoading] = useState(true);
    const [loadingState,setLoadingState] = useState(false);

    const fetchDetail = async()=>{
        try{
            const response =await fetch(`${Url}/properties/${listingId}`,{
                method:'GET',
            });
    
            const data= await response.json();
            data.amenities = data.amenities[0].split(',');
            setListing(data);
            setLoading(false);
        }
        catch(err){
            console.log(err);
        }
    };
    
    useEffect(()=>{
        fetchDetail();
    },[]);

    const [dateRange,setDataRange] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key:'selection'
    }]);

    const handleSelect = (ranges)=> {
        setDataRange([ranges.selection]);
    }


    const start = new Date(dateRange[0].startDate);
    const end = new Date(dateRange[0].endDate);
    const dayCount = Math.round(end-start) / (1000*60*60*24);

    const handleSubmit = async()=>{
        setLoadingState(true);
        try{
        const response= await fetch(`${Url}/payment/getkey`);
        const {key} = await response.json();

        const response2 = await fetch(`${Url}/payment/checkout`, {
            method:'POST',
            body:JSON.stringify({amount:listing.price*dayCount}),
            headers:{'Content-type':'application/json'}
        });
        const {order}=await response2.json();
        console.log(order);

        const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: "HomeStay",
            description: "Booking",
            image: "",
            order_id: order.id,
            handler: async function (response){
                const data={
                    order_id:order.id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    listingId:listing._id,
                    startDate:dateRange[0].startDate.toDateString(),
                    endDate:dateRange[0].endDate.toDateString(),
                    totalPrice:listing.price*dayCount
                };
                try{
                    const result = await fetch(`${Url}/payment/paymentverification`,{
                        method:'POST',
                        body:JSON.stringify(data),
                        headers:{'Content-type':'application/json'},
                        credentials:'include'
                    })
                    await result.json();
                    if(result.status===200){
                        toast.success('Successfully Booked')
                        navigate('/user/trips');
                    }
                    else{
                        toast.error('Server Error');
                    }
                    }catch(err){
                        console.log(err);
                        toast.error('Server Error');
                }
            },
            prefill: {
                name: "",
                email: "",
                contact: ""
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#121212"
            }
        };
        const razor = new window.Razorpay(options);
        razor.open();
        }catch(err){
            console.log(err);
            toast.error('Server Error')
        }
        setLoadingState(false);
    }

    return (
        <>
        <Navbar/>
        {loading?<Loader/>:
            <div className='listing-details'>
            <div className='title'>
                <h1>{listing.title}</h1>
                <div></div>
            </div>
            <div className='photos'>
                {listing.listingPhotos?.map((image,index)=>(
                    <img src={image} alt={`image ${index}`}/>
                ))}
            </div>
            <h2>{listing.type} in {listing.city}, {listing.province}</h2>
            <p>{listing.guestsCount} guest(s) · {listing.bedroomsCount} bedroom(s) · {listing.bedsCount} bed(s) · {listing.bathroomsCount} bath(s)</p>
            <hr/>

            <div className='profile'>
                <img src={listing.creator.profileImageURL}/>
                <h3>Hosted by {listing.creator.firstName} {listing.creator.lastName}</h3>
            </div>
            <hr/>

            <h3>Description</h3>
            <p>{listing.description}</p>
            <hr/>

            <h3>{listing.highlight}</h3>
            <p>{listing.highlightDesc}</p>
            <hr/>

            <h3>Address of Location</h3>
            <p>{listing.streetAddress}, {listing.province}, {listing.city}</p>
            <hr/>

            <div className='booking'>
                <div>
                    <h2>What this place offers?</h2>
                    <div className='amenities'>
                        {facilities.map((item,index)=>{
                            if(listing.amenities.includes(item.name)){
                                return(<div key={index} className='facility' >
                                    <div className='facility_icon'>{item.icon}</div>
                                    <p>{item.name}</p>
                                </div>)
                            }   
                        })}
                    </div>

                    <div>
                        <h2>How long do you want to stay?</h2>
                        <div className='date-range-calendar'>
                            <DateRange ranges={dateRange} onChange={handleSelect} minDate={new Date()}/>
                            <h2>₹ {listing.price} x {dayCount} night(s)</h2>
                            <h2>Total Price: ₹{listing.price*dayCount}</h2>
                            <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
                            <p>End Date: {dateRange[0].endDate.toDateString()}</p>

                            {user && !(user._id===listing.creator._id) && <button className="submit-btn" type='submit' onClick={handleSubmit} disabled={loadingState || listing.price*dayCount===0}>Booking
                                {loadingState && <CircularProgress size={20} sx={{color:'white' ,marginLeft:'10px'}}/>}
                            </button>}
                            {user._id===listing.creator._id && <button  className="submit-btn" disabled>Your Property</button>}
                        </div>
                    </div>

                </div>

            </div>
        </div>
        }
        <Footer/>
        </> 
    )
}

export default ListingDetail