import '../styles/List.scss';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import ListingCard from '../components/ListingCard';
import Footer from '../components/Footer';

const Wishlist = () => {
    const wishList=useSelector((state)=>state.user?.wishList);
    return (
        <>
            <Navbar/>
            <h2 className='title-list'>Your Wish List</h2>
            <div className='list'>
                {wishList?.length===0 && (<h3>No Results Found</h3>)}
                {wishList?.map(({_id,listingPhotos,city,province,country,category,type,price})=>(
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
            <Footer/>
        </>
    )
}

export default Wishlist