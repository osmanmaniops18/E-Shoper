import React,{useEffect, useRef, useState} from 'react';
import "./loginSignup.css";
import Loader from "../layout/Loader/Loader";
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { Link } from 'react-router-dom';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import {useSelector,useDispatch} from "react-redux";
import {clearError,login,register} from "../../actions/userAction";
import { useAlert } from 'react-alert';
import { useNavigate,useLocation } from "react-router-dom";

function LoginSignup() {

   const dispatch=useDispatch();
   const alert=useAlert();
     let navigate = useNavigate();
     const location = useLocation();

   const{error,loading,isAuthenticated}=useSelector((state)=>state.user);
    const loginTab=useRef(null);
    const registerTab=useRef(null);
    const switcherTab=useRef(null);

    const [loginEmail,setLoginEmail]=useState("");
    const [loginPassword,setLoginPassword]=useState("");
    const[user,setUser]=useState({
        name:"",
        email:"",
        password:""
    });
    const{name,email,password}=user;
    const[avatar,setAvatar]=useState();
    const[avatarPreview,setAvatarPreview]=useState("/Profile.png");
    const redirect = location.search ? location.search.split("=")[1] : "/account";

    useEffect(()=>{
    if(error){
        alert.error(error);
        dispatch(clearError());

    }
    if(isAuthenticated){
         navigate(redirect);
    }
    },[dispatch,error,alert,isAuthenticated,navigate,redirect])

    const switchTabs=(e,tab)=>{
     if(tab==="login"){
        switcherTab.current.classList.add("shiftToNeutral");
        switcherTab.current.classList.remove("shiftToRight");
        registerTab.current.classList.remove("shiftToNeutralForm");
        loginTab.current.classList.remove("shiftToLeft");
     }
     if(tab==="register"){
        switcherTab.current.classList.remove("shiftToNeutral");
        switcherTab.current.classList.add("shiftToRight");
        registerTab.current.classList.add("shiftToNeutralForm");
        loginTab.current.classList.add("shiftToLeft");
     }
    };

        const loginSubmit=(e)=>{
            e.preventDefault();
           dispatch(login(loginEmail,loginPassword))
        };
        const registerSubmit=(e)=>{
            e.preventDefault();
           const myForm=new FormData();
           myForm.set("name",name);
           myForm.set("email",email);
           myForm.set("password",password);
           myForm.set("avatar",avatar);
          dispatch(register(myForm));
        };

        const registerDataChange=(e)=>{
            if(e.target.name==="avatar"){
               
                const reader=new FileReader();
                reader.onload=()=>{
                    if(reader.readyState===2){
                        setAvatarPreview(reader.result);
                        setAvatar(reader.result);
                    }

                };
                reader.readAsDataURL(e.target.files[0]);
            }else{
                setUser({...user,[e.target.name]:e.target.value});
            }
        }
  return (
   <>
    {loading ? <Loader/>:( <>
        <div className='loginSignUpContainer'>
            <div className='loginSignUpBox'>
                <div>
                    <div className='login_signup_toggle'>
                        <p onClick={(e)=>switchTabs(e,"login")}>LOGIN</p>
                        <p onClick={(e)=>switchTabs(e,"register")}>REGISTER</p>
                    </div>
                    <button ref={switcherTab}></button>
                </div>
                <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
                      <div className='loginEmail'>
                        <MailOutlineOutlinedIcon />
                        <input
                        type="email"
                        placeholder='Email..'
                        required
                        value={loginEmail}
                        onChange={(e)=>setLoginEmail(e.target.value)}
                         />
                      </div>
                      <div className='loginPassword'>
                        <LockOpenOutlinedIcon/>
                        <input
                        type="password"
                        placeholder='Password'
                        required
                        value={loginPassword}
                        onChange={(e)=>setLoginPassword(e.target.value)}
                         />
                      </div>
                      <Link to="/password/forgot">Forgot Password ?</Link>
                      <input type="submit" value="Login" className='loginBtn'/>
                </form>
                <form
                className='signUpform'
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}

                >

                <div className='signUpName'>
                 <FaceOutlinedIcon/>
                 <input
                 type="text"
                 placeholder='Name'
                 required
                 name='name'
                 value={name}
                 onChange={registerDataChange}
                  />
                </div>
                <div className='signUpEmail'>
                <MailOutlineOutlinedIcon />
                <input
                 type="email"
                 placeholder='Email'
                 required
                 name='email'
                 value={email}
                 onChange={registerDataChange}
                  />
                </div>
                <div className='signUpPassword'>
                <LockOpenOutlinedIcon/>
                <input
                 type="password"
                 placeholder='Password'
                 required
                 name='password'
                 value={password}
                 onChange={registerDataChange}
                  />
                </div>
                <div id='registerImage'>
                    <img src={avatarPreview} alt='Avatar Img'/>
                    <input
                    type="file"
                    name='avatar'
                    accept='image/*'
                    onChange={registerDataChange}
                     />
                </div>
                <input
                type="submit"
                value="Register"
                className='signUpBtn'
              
                 />

                </form>
            </div>
        </div>
    </>)}
   </>
  )
}

export default LoginSignup;