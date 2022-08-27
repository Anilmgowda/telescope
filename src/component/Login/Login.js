import React, { useState, useEffect} from 'react'
import { useNavigate} from 'react-router-dom'
import {useLocation } from "react-router"
import { useDispatch } from "react-redux";
import { TeleScopeImage } from '../Images/TeleScope'
import { getAccessTokenReq } from "../../store/actions";
import Loader from "../../commonComponents/Loader/Loader";
import { Oauth } from "../Oauth";
import logoImg from "../../assets/images/logo.png"

import './login.scss'

const Login = () => {
  const [isLoading, setLoading] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const search = useLocation().search;
  const code = new URLSearchParams(search).get('code');

  useEffect(()=>{
    if(location?.state?.from?.pathname) {
      localStorage.setItem("externalRoutes", location?.state?.from?.pathname)
    }
  },[location?.state?.from])

  useEffect(() => {
    if (code) {
      setLoading(true)
      dispatch(getAccessTokenReq(code)).then(res => {
        if(res.status === "success"){
          setLoading(false)
        }
      }).catch(err=>{
        console.log("google auth error -->", err )
        setLoading(false)
      })
    }
  }, [code])


  return (
    <> 
    {isLoading ? <Loader scale={40} message={"Logging you..."}/> :  <div id="page-wrapper">
      <div className="logo-box">
        <img src={logoImg} />
      </div>
      <div className="main-container">
        <div className="title">Orion</div>
        <div className="description">
          An ecosystem of products to enable investors to find great companies &
          influence returns to telescope partners!
        </div>
        <div>
          <Oauth />
        </div>
      </div>
    </div>}
    </>
  )
}

export default Login;