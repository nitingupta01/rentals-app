import React, {useEffect, useState} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import '../styles/Register.scss';
import {toast } from 'react-toastify';
import {Url} from '../utils/constant';
import { CircularProgress } from '@mui/material';


const RegisterPage = () => {

  const navigate=useNavigate();
  const [loadingState,setLoadingState]=useState(false);

  const [formData,setFormData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    confirmPassword:"",
    profileImage:null
  });

  const [passwordMatch,setPasswordMatch]=useState(true);

  useEffect(()=>{
    setPasswordMatch(formData.password===formData.confirmPassword || formData.confirmPassword==="")
  })

  const handleChange = (e)=>{
    const {name,value,files} = e.target;
    setFormData({...formData,
      [name]:[value],
      [name]:name==="profileImage" ? files[0]:value
    })
  };

  
  const handleSubmit = async (e) =>{
    e.preventDefault();
    setLoadingState(true);
    try{
      const register_form=new FormData();
      for(var key in formData){
        register_form.append(key,formData[key]);
      }

      const response = await fetch(`${Url}/auth/register`,{
        method:"POST",
        body:register_form,
      })
      const res=await response.json();
      if(response.status===201){
        toast.success(res.message);
        navigate("/login");
      }
      else{
        toast.info(res.message);
      }
    }
    catch(err){
      toast.error('Server Error');
    }    
    setLoadingState(false);
  }

  return (
    <div className='register'>
        <div className='register_content'>
            <form className='register_content_form' onSubmit={handleSubmit}>
              <input 
              placeholder='First Name'
              name='firstName' 
              value={formData.firstName} 
              onChange={handleChange}
              required/>
              <input 
              placeholder='Last Name'
              name='lastName' 
              value={formData.lastName} 
              onChange={handleChange}
              required/>
              <input 
              placeholder='Email'
              name='email' 
              type='email' 
              value={formData.email} 
              onChange={handleChange}
              required/>
              <input 
              placeholder='Password'
              name='password' 
              type='password' 
              value={formData.password} 
              onChange={handleChange}
              required/>
              <input 
              placeholder='Confirm Password'
              name='confirmPassword' 
              type='password' 
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              />
              {!passwordMatch && (<p style={{color:'red'}}>Password Mismatch found</p>)}
              <input 
              id='image' 
              type='file' 
              name="profileImage" 
              accept='image/*' 
              style={{display:'none'}}
              onChange={handleChange}
              />
              <label htmlFor='image'>
                <img src='/assets/addImage.png' alt='add profile photo'/>
                <p>Upload Your Photo</p>
              </label>
              {formData.profileImage && (
                <img src={URL.createObjectURL(formData.profileImage)} alt='profileimage'
                style={{width:"80px", height:"80px",
                  borderRadius:'50%'
                }}
                />
              )}
              <button type='submit' disabled={!passwordMatch || loadingState}>REGISTER
              {loadingState && <CircularProgress size={20} sx={{color:'white' ,marginLeft:'10px'}}/>}
              </button>
            </form>
            <a>Already have an account? <Link to='/login'>Login</Link></a>
        </div>
    </div>
  )
}

export default RegisterPage