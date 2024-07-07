import '../styles/CreateListing.scss';
import Navbar from '../components/Navbar';
import { categories , types , facilities } from '../data/data';
import '../styles/CreateListing.scss';
import { RemoveCircleOutline , AddCircleOutline} from '@mui/icons-material';
import variables from '../styles/variables.scss';
import {IoIosImages} from 'react-icons/io';
import { useState } from 'react';
import { BiTrash } from 'react-icons/bi';
import {toast} from 'react-toastify';
import {Url} from '../utils/constant';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const CreateListing = () => {
    const [loadingState,setLoadingState]=useState(false);
    const [category,setCategory]=useState('');
    const [type,setType] = useState('');
    const [guests,setGuests]=useState(0);
    const [bedrooms,setBedrooms]=useState(0);
    const [beds,setBeds]=useState(0);
    const [bathrooms,setBathrooms]=useState(0);
    const [locationDetails,setLocationDetails] = useState({
        streetAddress:'',
        aptSuite:'',
        city:'',
        province:'',
        country:'',
    })
    const [photos,setPhotos] = useState([]);
    const [selectedFacilities,setSelectedFacilities]=useState([]);
    const [formDescription,setFormDescription]=useState({
        title:'',
        description:'',
        highlight:'',
        highlightDesc:'',
        price:0
    });
    const navigate=useNavigate();
    
    const BasicAmenity = ({key,name,val,setVal})=>(
        <div className='basic' key={key}>
            <p>{name}</p>
            <div className='basic_count'></div>
            <RemoveCircleOutline sx={{fontSize:'25px', cursor:'pointer',"&:hover":{color:variables.pinkred}}} onClick={()=>{setVal(val=>val===0?0:val-1)}}/>
            <p>{val}</p>
            <AddCircleOutline sx={{fontSize:'25px', cursor:'pointer',"&:hover":{color:variables.pinkred}}} onClick={()=>{setVal(val=>val+1)}}/>
        </div>
    );

    const handleFacilityClick = (item)=>{
        if(selectedFacilities.includes(item.name)){
            setSelectedFacilities(selectedFacilities.filter((facility)=>facility!==item.name));
        }
        else{
            setSelectedFacilities([...selectedFacilities,item.name]);
        }
    }

    const handleLocation = (e)=>{
        const name = e.target.name;
        setLocationDetails({...locationDetails,[name]:e.target.value});
    }

    const handleUpload = (e)=>{
        console.log('here');
        const newPhotos=e.target.files;
        setPhotos((prevphotos)=>([...prevphotos,...newPhotos]));
        console.log(photos);
    }

    const handleRemovePhoto = (indexToRemove)=>{
        setPhotos((prevphotos)=>prevphotos.filter((photo,index)=>index!==indexToRemove))
    };

    const handleChangeDescription = (e)=>{
        const name = e.target.name;
        setFormDescription({...formDescription,[name]:e.target.value});
    }


    const handleCreateListing = async(e)=>{
        e.preventDefault();
        setLoadingState(true);
        try{
            const listingform = new FormData();
            listingform.append('category',category);
            listingform.append('type',type);
            listingform.append('streetAddress',locationDetails.streetAddress);
            listingform.append('aptSuite',locationDetails.aptSuite);
            listingform.append('city',locationDetails.city);
            listingform.append('province',locationDetails.province);
            listingform.append('country',locationDetails.country);
            listingform.append('amenities',selectedFacilities);
            listingform.append('guestsCount',guests);
            listingform.append('bedroomsCount',bedrooms);
            listingform.append('bedsCount',beds);
            listingform.append('bathroomsCount',bathrooms);
            listingform.append('title',formDescription.title);
            listingform.append('description',formDescription.description);
            listingform.append('highlight',formDescription.highlight);
            listingform.append('highlightDesc',formDescription.highlightDesc);
            listingform.append('price',formDescription.price);
            photos.forEach((photo)=>{
                listingform.append('listingPhotos',photo);
            });

            const response = await fetch(`${Url}/properties/create`,{
                method:'POST',
                body:listingform,
                credentials:'include'
            });
            
            const result=await response.json();
            if(response.status===201){
                toast.success(result.message);
                navigate("/");
            }
            else{
                toast.info(result.message);
            }
        }catch(err){
            toast.error('Server Error');
        }
        setLoadingState(false);
    }

  return (
    <>
    <Navbar/>
    <div className='create-listing' aria-disabled={loadingState}>
        <h1>Publish Your Place</h1>
        <form onSubmit={handleCreateListing}>
            <div className='create-listing_step1'>
                <h2>Step1: Tell about your place</h2>
                <hr/>
                <h3>Which of these categories best describe your place</h3>
                <div className='category-list'>
                    {categories?.slice(1,categories.length).map((item,index)=>(
                        <div className={`category ${category===item.label?"selected":""}`} key={index} onClick={()=>{setCategory(item.label)}}>
                            <div className='category_icon'>{item.icon}</div>
                            <p>{item.label}</p>
                        </div>
                    ))}
                </div>
                

                <h3>What type of place will guests have?</h3>
                <div className='type-list'>
                    {types?.map((item,index)=>(
                        <div className={`type ${type===item.name?"selected":""}`} key={index} onClick={()=>{setType(item.name)}}>
                            <div className='type_text'>
                                <h4>{item.name}</h4>
                                <p>{item.description}</p>
                            </div>
                            <div className='type_icon'>
                                {item.icon}
                            </div>
                        </div>
                    ))}
                </div>


                <h3>Where's your place located</h3>
                <div style={{padding:"0 20px"}}>
                <div className='full'>
                    <div className='location'>
                        <p>Street Address</p>
                        <input type='text' placeholder='Street Address' name="streetAddress" value={locationDetails.streetAddress} onChange={handleLocation} required/>
                    </div>
                </div>
                <div className='half'>
                    <div className='location'>
                        <p>Apartment, Suite, etc. (if applicable)</p>
                        <input type='text' placeholder='Apt, Suite etc..' name='aptSuite' value={locationDetails.aptSuite} onChange={handleLocation}/>
                    </div>
                    <div className='location'>
                        <p>City</p>
                        <input type='text' placeholder='City' name='city' value={locationDetails.city} onChange={handleLocation}
                        required/>
                    </div>
                </div>
                <div className='half'>
                    <div className='location'>
                        <p>Province</p>
                        <input type='text' placeholder='Province' name='province' value={locationDetails.province} onChange={handleLocation}
                        required/>
                    </div>
                    <div className='location'>
                        <p>Country</p>
                        <input type='text' placeholder='Country' name='country' value={locationDetails.country} onChange={handleLocation}
                        required/>
                    </div>
                </div>
                </div>

                <h3>Share some basics about your place</h3>
                <div className='basics'>
                    <BasicAmenity key="guests" name="Guests" val={guests} setVal={setGuests}/>
                    <BasicAmenity key="bedrooms" name="Bedrooms" val={bedrooms} setVal={setBedrooms}/>
                    <BasicAmenity key="beds" name="Beds" val={beds} setVal={setBeds}/>
                    <BasicAmenity key="bathrooms" name="Bathrooms" val={bathrooms} setVal={setBathrooms}/>
                </div>
            </div>


            <div className='create-listing_step2'>
                <h2>Step 2:Make your place stand out</h2>
                <hr/>

                <h3>Tell guests what your place has to offer</h3>
                <div className='amenities'>
                    {facilities?.map((item,index)=>(
                        <div className={`facility ${selectedFacilities.includes(item.name)?"selected":""}`}key={index} onClick={()=>handleFacilityClick(item)}>
                            <div className='facility_icon'>{item.icon}</div>
                            <p>{item.name}</p>
                        </div>
                    ))}
                </div>

                <h3>Add some photos of your place</h3>
                <div className='photos'>
                    {photos.length>=1 && (
                        <>
                        {photos.map((photo,index)=>(
                            <div className='photo'>
                                <img src={URL.createObjectURL(photo)} alt='index'/>
                                <button type='button' onClick={()=>{handleRemovePhoto(index)}}><BiTrash/></button>
                            </div> 
                        ))}
                        </>
                    )}
                    <input 
                        id='image'
                        type='file'
                        style={{display:'none'}}
                        accept='image/*'
                        onChange={handleUpload}
                        multiple
                    />
                    <label htmlFor='image' className='together'>
                        <div className='icon'><IoIosImages/></div>
                        <p>Upload Your Images</p>
                    </label> 
                </div>

                <h3>What make your place attractive and exciting?</h3>
                <div className="description">
                <p>Title</p>
                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={formDescription.title}
                    onChange={handleChangeDescription}
                    required
                />
                <p>Description</p>
                <textarea
                    type="text"
                    placeholder="Description"
                    name="description"
                    value={formDescription.description}
                    onChange={handleChangeDescription}
                    required
                />
                <p>Highlight</p>
                <input
                    type="text"
                    placeholder="Highlight"
                    name="highlight"
                    value={formDescription.highlight}
                    onChange={handleChangeDescription}
                    required
                />
                <p>Highlight details</p>
                <textarea
                    type="text"
                    placeholder="Highlight details"
                    name="highlightDesc"
                    value={formDescription.highlightDesc}
                    onChange={handleChangeDescription}
                    required
                />
                <p>Now, set your PRICE</p>
                <span>₹</span>
                <input
                    type="number"
                    placeholder="100"
                    name="price"
                    value={formDescription.price}
                    onChange={handleChangeDescription}
                    className="price"
                    required
                />
                </div>  
            </div>
            <button type='submit' className='submit_btn' disabled={loadingState}>List Your Property
                {loadingState && <CircularProgress size={20} sx={{color:'white' ,marginLeft:'10px'}}/>}
            </button>
        </form> 
    </div>
    <Footer/>
    </>
  )
}

export default CreateListing;