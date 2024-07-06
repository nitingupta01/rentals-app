import React , {useState} from 'react';
import '../styles/ListingCard.scss';
import {ArrowBackIosNew,ArrowForwardIos} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {Url} from '../utils/constant';
import { setWishList } from '../redux/state';
import { Favorite } from '@mui/icons-material';

const ListingCard = ({_id,listingPhotos,city,province,country,category,type,price,startDate,endDate,triped}) => {
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const [currentIndex,setCurrentIndex] = useState(0);
  const goToNextSlide = (e) =>{
    e.stopPropagation();
    setCurrentIndex((prevIndex)=>(prevIndex+1)%listingPhotos.length);
  }
  const goToPrevSlide = (e) =>{
    e.stopPropagation();
    setCurrentIndex((prevIndex)=>prevIndex===0?listingPhotos.length-1:prevIndex-1);
  }

  const user = useSelector((state)=>state.user);
  const wishList = user?user.wishList:[];
  const isLiked = wishList?.find((item)=>item?._id===_id);

  const updateWishlist = async()=>{
    try{
      const response = await fetch(`${Url}/users/wishlist/${_id}`,{
        method:'PATCH',
        headers:{'Content-type':'application/json'},
        credentials:'include'
      });
      const result=await response.json();
      dispatch(setWishList(result.wishList));
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className='listing-card' onClick={()=>{navigate(`/properties/${_id}`)}}>
      <div className='slider-container'>
        <div className='slider' style={{transform:`translateX(-${currentIndex*100}%)`}}>
        {listingPhotos?.map((photo,index)=>(
          <div key={index} className='slide'>
            <img src={photo} alt={`photo ${index+1}`}/>
            <div className='prev-button'>
              <ArrowBackIosNew sx={{fontSize:"15px"}} onClick={goToPrevSlide}/>
            </div>
            <div className='next-button'>
              <ArrowForwardIos sx={{fontSize:"15px"}} onClick={goToNextSlide}/>
            </div>
          </div>
          ))}
          </div>
      </div>
      <h3>{city}, {province}, {country}</h3>
      <p>{category}</p>
      {triped && <>
        <p>{startDate}-{endDate}</p>
        <p><span>₹{price}</span> Total Price</p>
      </>
      }
      {!triped && <>
        <p>{type}</p>
        <p><span>₹{price}</span> per night</p>
      </>
      }

      {user && 
      <div className='favorite' onClick={(e)=> {e.stopPropagation(); updateWishlist()}}>
        {isLiked && <Favorite sx={{color:'red'}}/>}
        {!isLiked && <Favorite sx={{color:'white'}}/>}
      </div>}
    </div>
  )
}

export default ListingCard;